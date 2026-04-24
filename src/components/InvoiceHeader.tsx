export default function InvoiceHeader() {
  return (
    <div className="text-center border-b-2 border-black pb-4 mb-6">
      <h1 className="text-3xl font-bold tracking-wide text-black">
        SHARON INDUSTRIES
      </h1>
      <p className="text-sm text-black mt-1">
        Kanjiramattom P.O, Ernakulam &ndash; 682315
      </p>
      <p className="text-sm text-black">GSTIN: 32BCCPR5468N1Z3</p>
      <div className="mt-3 inline-block border border-black px-4 py-1 text-sm font-semibold tracking-widest">
        TAX INVOICE
      </div>
    </div>
  );
}
