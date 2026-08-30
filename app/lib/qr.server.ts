import qrcode from "qrcode-generator";

/**
 * The Trakheesi permit QR, drawn by us.
 *
 * Amelia's `permit.qrImageUrl` is null on every record in the catalogue; what it
 * does send is `permit.verificationUrl`, the Dubai Land Department validation
 * link with the listing's token in it. That link is precisely what a Trakheesi
 * QR encodes, so there is nothing to wait for upstream: we can draw the code.
 *
 * It is drawn as vector rather than fetched as a bitmap, which removes the
 * problem the old block was fighting. A supplied PNG can arrive smaller than we
 * need it, and upscaling one blurs the module edges a scanner reads; a path
 * is exact at any size and prints at the printer's resolution.
 *
 * Server-only: the encoder never needs to reach the browser. The loader runs
 * this once and passes the finished path down, and a page held at the edge for
 * five minutes encodes it about as often as it is revalidated.
 */
export interface PermitQr {
  /** modules across, and down: the viewBox is size × size */
  size: number;
  /** every dark module as one path, horizontal runs merged */
  path: string;
}

export function permitQr(verificationUrl: string | null | undefined): PermitQr | null {
  const url = verificationUrl?.trim();
  if (!url) return null;

  try {
    /* Type 0 picks the smallest version the text fits in. Level M is the 15%
       recovery the permit codes in circulation use, and it keeps the module
       count down: a validation URL lands at 49 modules across, where level Q
       would push it to 57 and make every module smaller on the page. */
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();

    const size = qr.getModuleCount();
    let path = "";
    for (let y = 0; y < size; y++) {
      let x = 0;
      while (x < size) {
        if (!qr.isDark(y, x)) {
          x += 1;
          continue;
        }
        // one run of dark modules, one subpath: roughly a third the markup of
        // emitting each module on its own
        let run = 1;
        while (x + run < size && qr.isDark(y, x + run)) run += 1;
        path += `M${x} ${y}h${run}v1h-${run}z`;
        x += run;
      }
    }
    return { size, path };
  } catch (err) {
    // A permit we cannot draw a code for still shows its number and its link:
    // the compliance line is the requirement, the QR is the convenience.
    console.error("[qr] could not encode permit verification URL:", err);
    return null;
  }
}
