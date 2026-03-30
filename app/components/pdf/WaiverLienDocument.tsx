import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PDF_COLORS, sharedPdfStyles } from "./pdfSharedStyles";

const local = StyleSheet.create({
  titleWrap: { alignItems: "center", marginBottom: 6 },
  title: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: 1.25,
    color: PDF_COLORS.ink,
    letterSpacing: 0.25,
    paddingHorizontal: 16,
  },
  titleRule: {
    width: 72,
    height: 2,
    backgroundColor: PDF_COLORS.brand,
    marginTop: 4,
    borderRadius: 1,
  },
  salutation: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.ink,
    marginBottom: 2,
  },
  body: { lineHeight: 1.35, marginBottom: 5, fontSize: 7.5, color: PDF_COLORS.ink },
  bodyBlock: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: PDF_COLORS.rowAlt,
    borderLeftWidth: 2,
    borderLeftColor: PDF_COLORS.brand,
    marginTop: 6,
    marginBottom: 2,
  },
  bold: { fontFamily: "Helvetica-Bold", color: PDF_COLORS.ink },
  /** Bottom block only — pinned to foot of page */
  pageFooter: {
    flexShrink: 0,
    marginTop: 2,
  },
  /** Top row: DATE | SIGNATURE labels */
  sigLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 2,
  },
  sigLabelDateCol: {
    flexGrow: 1,
    paddingRight: 16,
    maxWidth: "58%",
  },
  sigLabelSignCol: {
    width: "40%",
    minWidth: 140,
    alignItems: "flex-end",
  },
  /** Second row: date text and signature line share one baseline */
  sigInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 2,
  },
  sigDateInputCol: {
    flexGrow: 1,
    paddingRight: 16,
    maxWidth: "58%",
  },
  sigSignInputCol: {
    width: "40%",
    minWidth: 140,
    alignItems: "flex-end",
  },
  sigLabelRight: {
    fontSize: 6,
    color: PDF_COLORS.inkSoft,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "right",
    width: "100%",
  },
  fieldLabel: {
    fontSize: 6,
    color: PDF_COLORS.inkSoft,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  dateLine: { fontSize: 8, color: PDF_COLORS.ink },
  printLine: { marginTop: 3, fontSize: 7.5, color: PDF_COLORS.ink, lineHeight: 1.3 },
  footnote: {
    fontSize: 6,
    marginTop: 5,
    lineHeight: 1.3,
    color: PDF_COLORS.inkSoft,
  },
  slogan: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 7,
    color: PDF_COLORS.inkMuted,
  },
  sloganBrand: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: PDF_COLORS.brand },
  /** Unsigned: line sits under label like “Dated this…”; signed: room for image */
  sigImageSlot: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  sigImageSlotFilled: {
    minHeight: 36,
    maxHeight: 40,
    justifyContent: "flex-end",
  },
  sigImage: {
    width: 160,
    height: 36,
    objectFit: "contain",
  },
  signedNote: {
    fontSize: 6,
    color: PDF_COLORS.signGreen,
    marginBottom: 4,
    textAlign: "right",
    width: "100%",
  },
});

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export type WaiverLienDocumentProps = {
  logoSrc: string;
  jobNumber: string;
  subcontractorCompany: string;
  paymentAmount: number;
  customerName: string;
  customerAddress: string;
  printNameTitle: string;
  signatureDataUrl?: string;
};

export function WaiverLienDocument({
  logoSrc,
  jobNumber,
  subcontractorCompany,
  paymentAmount,
  customerName,
  customerAddress,
  printNameTitle,
  signatureDataUrl = "",
}: WaiverLienDocumentProps) {
  const s = sharedPdfStyles;

  return (
    <Document>
      <Page size="LETTER" wrap={false} style={s.page}>
        <View style={s.topAccent} fixed />

        <View style={s.mainColumn}>
          <View style={s.headerRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/render Image */}
            <Image src={logoSrc} style={s.logo} />
            <View style={s.divider} />
            <View style={s.companyBlock}>
              <Text style={s.companyTitle}>Klaus Larsen Roofing</Text>
              <Text style={s.companyLine}>29 Northridge Drive, North Windham, CT 06256</Text>
              <Text style={s.companyLine}>(860) 563-7661</Text>
              <Text style={s.companyLine}>www.klauslarsen.com</Text>
            </View>
          </View>

          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Reference</Text>
            <Text style={s.metaLine}>Job #{jobNumber}</Text>
          </View>

          <View style={local.titleWrap}>
            <Text style={local.title}>Waiver and Release of Lien Upon Final Payment</Text>
            <View style={local.titleRule} />
          </View>

          <Text style={local.salutation}>To Whom It May Concern:</Text>

          <Text style={local.body}>
            <Text>The undersigned </Text>
            <Text style={local.bold}>{subcontractorCompany}</Text>
            <Text>
              , having been employed as a subcontractor by Klaus Larsen LLC, in consideration of the
              full and final payment in the amount of{" "}
            </Text>
            <Text style={local.bold}>{money(paymentAmount)}</Text>
            <Text>
              {" "}
              and other good and valuable consideration, hereby waives and releases its lien and
              right to claim a lien for labor, services, or material furnished to{" "}
            </Text>
            <Text style={local.bold}>{customerName}</Text>
            <Text> (Customer) at the Customer\u2019s address at </Text>
            <Text style={local.bold}>{customerAddress}</Text>
            <Text>.</Text>
          </Text>

          <View style={local.bodyBlock}>
            <Text style={[local.body, { marginBottom: 0 }]}>
              The subcontractor further waives all lien rights for labor, materials, and fixtures
              furnished in connection with the above-referenced project,{" "}
              <Text style={local.bold}>INCLUDING EXTRAS.*</Text>
            </Text>
          </View>
        </View>

        <View style={local.pageFooter} wrap={false}>
          <View style={s.footerHairline}>
            <Text style={local.fieldLabel}>Signatures &amp; identification</Text>
            {signatureDataUrl ? (
              <Text style={local.signedNote}>Signed electronically (in-app preview)</Text>
            ) : null}

            <View style={{ width: "100%", marginBottom: 4 }}>
              <View style={local.sigLabelsRow}>
                <View style={local.sigLabelDateCol}>
                  <Text style={local.fieldLabel}>Date</Text>
                </View>
                <View style={local.sigLabelSignCol}>
                  <Text style={local.sigLabelRight}>Signature</Text>
                </View>
              </View>
              <View style={local.sigInputsRow}>
                <View style={local.sigDateInputCol}>
                  <Text style={local.dateLine}>Dated this ____________________</Text>
                </View>
                <View style={local.sigSignInputCol}>
                  <View
                    style={[
                      local.sigImageSlot,
                      signatureDataUrl ? local.sigImageSlotFilled : {},
                    ]}
                  >
                    {signatureDataUrl ? (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/render Image */}
                        <Image src={signatureDataUrl} style={local.sigImage} />
                      </>
                    ) : (
                      <View style={{ width: "100%", alignSelf: "stretch" }}>
                        <View style={s.sigLine} />
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <Text
                style={[
                  s.footerCaption,
                  { textAlign: "right", width: "40%", minWidth: 140, alignSelf: "flex-end" },
                ]}
              >
                Authorized signer
              </Text>
            </View>

            <Text style={local.printLine}>
              Print name &amp; title: {printNameTitle}
            </Text>
            <Text style={local.printLine}>Company: {subcontractorCompany}</Text>

            <Text style={s.footerHint}>When using an iPad, capture the signature in the marked area.</Text>

            <Text style={local.footnote}>
              *EXTRAS INCLUDE BUT ARE NOT LIMITED TO CHANGE ORDERS, BOTH ORAL AND WRITTEN, TO THE
              CONTRACT.
            </Text>

            <Text style={local.slogan}>
              Put a <Text style={local.sloganBrand}>Klaus</Text> on your{" "}
              <Text style={local.sloganBrand}>House!</Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
