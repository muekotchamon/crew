import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CompensationTableRow } from "../../lib/buildCompensationRows";
import { PDF_COLORS, sharedPdfStyles } from "./pdfSharedStyles";

const local = StyleSheet.create({
  docTitleWrap: { alignItems: "center", marginBottom: 6 },
  docTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.ink,
    textAlign: "center",
    letterSpacing: 0.15,
  },
  docTitleRule: {
    width: 72,
    height: 2,
    backgroundColor: PDF_COLORS.brand,
    marginTop: 4,
    borderRadius: 1,
  },
  docSubtitle: {
    fontSize: 6.5,
    color: PDF_COLORS.inkMuted,
    textAlign: "center",
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tableWrap: {
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
    borderRadius: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PDF_COLORS.tableHeaderBg,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.tableHeaderText,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.border,
  },
  rowAlt: { backgroundColor: PDF_COLORS.rowAlt },
  colProduct: { width: "38%", paddingRight: 4 },
  colCost: { width: "20%", textAlign: "right" },
  colQty: { width: "14%", textAlign: "center" },
  colInstall: { width: "28%", textAlign: "right" },
  cellText: { fontSize: 7.5, lineHeight: 1.2, color: PDF_COLORS.ink },
  cellMuted: { fontSize: 7.5, lineHeight: 1.2, color: PDF_COLORS.inkMuted },
  /** Pinned with signatures: slim full-width total bar */
  bottomStack: {
    flexShrink: 0,
    marginTop: 2,
  },
  totalStripe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: PDF_COLORS.border,
    backgroundColor: PDF_COLORS.rowAlt,
  },
  totalLabelInline: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flexShrink: 1,
    paddingRight: 8,
  },
  totalValueInline: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.ink,
    textAlign: "right",
  },
  /** Signature block directly under total stripe */
  pageFooter: {
    flexShrink: 0,
    paddingTop: 5,
  },
  footerLegal: {
    fontSize: 7,
    lineHeight: 1.3,
    color: PDF_COLORS.inkMuted,
    marginBottom: 6,
  },
  /** Full width: Date left, Signature right */
  sigBlock: {
    width: "100%",
    alignSelf: "stretch",
  },
  sigLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 2,
  },
  sigLabelDateCol: {
    flexGrow: 1,
    paddingRight: 20,
    maxWidth: "52%",
  },
  sigLabelSignCol: {
    width: "42%",
    minWidth: 150,
    alignItems: "flex-end",
  },
  sigInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 2,
  },
  sigDateInputCol: {
    flexGrow: 1,
    paddingRight: 20,
    maxWidth: "52%",
  },
  sigSignInputCol: {
    width: "42%",
    minWidth: 150,
    alignItems: "flex-end",
  },
  sigFieldLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.inkSoft,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sigFieldLabelRight: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.inkSoft,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
    width: "100%",
  },
  sigLineFull: {
    width: "100%",
    alignSelf: "stretch",
  },
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
  sigHint: {
    fontSize: 6,
    color: PDF_COLORS.inkSoft,
    marginTop: 6,
    textAlign: "center",
  },
});

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type CompensationAgreementDocumentProps = {
  logoSrc: string;
  jobNumber: string;
  accountName: string;
  accountAddress: string;
  rows: CompensationTableRow[];
  totalInstallationCost: number;
  payeeCompanyName: string;
  /** PNG data URL from in-app signature modal */
  signatureDataUrl?: string;
};

export function CompensationAgreementDocument({
  logoSrc,
  jobNumber,
  accountName,
  accountAddress,
  rows,
  totalInstallationCost,
  payeeCompanyName,
  signatureDataUrl = "",
}: CompensationAgreementDocumentProps) {
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
            <Text style={s.metaLabel}>Job &amp; account</Text>
            <Text style={s.metaLine}>Job #{jobNumber}</Text>
            <Text style={s.metaLine}>{accountName}</Text>
            <Text style={s.metaLine}>{accountAddress}</Text>
            <Text style={[s.metaLabel, { marginTop: 5 }]}>Subcontractor</Text>
            <Text style={s.metaLine}>{payeeCompanyName}</Text>
          </View>

          <View style={local.docTitleWrap}>
            <Text style={local.docTitle}>Subcontractor Compensation Agreement</Text>
            <View style={local.docTitleRule} />
            <Text style={local.docSubtitle}>Payment schedule and installation cost summary</Text>
          </View>

          <View style={local.tableWrap}>
            <View style={local.tableHeader}>
              <Text style={[local.th, local.colProduct]}>Product</Text>
              <Text style={[local.th, local.colCost]}>Cost / Qty</Text>
              <Text style={[local.th, local.colQty]}>Qty</Text>
              <Text style={[local.th, local.colInstall]}>Installation</Text>
            </View>
            {rows.map((r, i) => (
              <View key={i} style={[local.row, i % 2 === 1 ? local.rowAlt : {}]}>
                <Text style={[local.cellText, local.colProduct]}>{r.product}</Text>
                <Text style={[local.cellMuted, local.colCost]}>{money(r.costPerQty)}</Text>
                <Text style={[local.cellText, local.colQty]}>{r.qty}</Text>
                <Text style={[local.cellText, local.colInstall]}>{money(r.installationCost)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={local.bottomStack} wrap={false}>
          <View style={local.totalStripe}>
            <Text style={local.totalLabelInline}>Total installation cost</Text>
            <Text style={local.totalValueInline}>{money(totalInstallationCost)}</Text>
          </View>

          <View style={local.pageFooter}>
            <Text style={local.footerLegal}>
              By signing, {payeeCompanyName} confirms the payment report above is accurate and
              accepted.
            </Text>
            {signatureDataUrl ? (
              <Text style={local.signedNote}>Signed electronically (in-app preview)</Text>
            ) : null}
            <View style={local.sigBlock}>
              <View style={local.sigLabelsRow}>
                <View style={local.sigLabelDateCol}>
                  <Text style={local.sigFieldLabel}>Date</Text>
                </View>
                <View style={local.sigLabelSignCol}>
                  <Text style={local.sigFieldLabelRight}>Signature</Text>
                </View>
              </View>
              <View style={local.sigInputsRow}>
                <View style={local.sigDateInputCol}>
                  <View style={local.sigLineFull}>
                    <View style={s.sigLine} />
                  </View>
                </View>
                <View style={local.sigSignInputCol}>
                  <View
                    style={[
                      local.sigImageSlot,
                      signatureDataUrl ? local.sigImageSlotFilled : {},
                    ]}
                  >
                    {signatureDataUrl ? (
                      // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/render Image
                      <Image src={signatureDataUrl} style={local.sigImage} />
                    ) : (
                      <View style={local.sigLineFull}>
                        <View style={s.sigLine} />
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <Text
                style={[
                  s.footerCaption,
                  { textAlign: "right", width: "42%", minWidth: 150, alignSelf: "flex-end" },
                ]}
              >
                Authorized signer
              </Text>
              <Text style={local.sigHint}>
                When using an iPad, capture the signature in the marked area.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
