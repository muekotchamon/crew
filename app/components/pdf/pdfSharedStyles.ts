import { StyleSheet } from "@react-pdf/renderer";

/** Shared palette & layout for Compensation + Waiver PDFs */
export const PDF_COLORS = {
  brand: "#c41230",
  ink: "#0f172a",
  inkMuted: "#64748b",
  inkSoft: "#94a3b8",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  tableHeaderBg: "#1e293b",
  tableHeaderText: "#f8fafc",
  rowAlt: "#f8fafc",
  surface: "#ffffff",
  panelBg: "#f1f5f9",
  accentSoft: "#fef2f2",
  /** Success / Sign online (Bootstrap success green for clear “button” read) */
  signGreen: "#198754",
  signGreenBorder: "#157347",
  signGreenText: "#ffffff",
} as const;

export const sharedPdfStyles = StyleSheet.create({
  /** Full-height column so a bottom block can sit on the page edge */
  /** Tight margins so Compensation + Waiver fit one LETTER page in typical use */
  page: {
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 40,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: PDF_COLORS.ink,
    backgroundColor: PDF_COLORS.surface,
    flexDirection: "column",
    minHeight: 792,
  },
  /** Main flow (header → body); grows so footer stays at bottom on short pages */
  mainColumn: {
    flexGrow: 1,
    flexDirection: "column",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: PDF_COLORS.brand,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 2,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.border,
  },
  logo: { width: 64, objectFit: "contain" },
  divider: {
    width: 2,
    backgroundColor: PDF_COLORS.brand,
    marginHorizontal: 10,
    alignSelf: "stretch",
    borderRadius: 1,
  },
  companyBlock: { flex: 1, justifyContent: "center" },
  companyTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.ink,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  companyLine: {
    fontSize: 7,
    color: PDF_COLORS.inkMuted,
    marginBottom: 1,
    lineHeight: 1.25,
  },
  metaBlock: {
    marginTop: 6,
    marginBottom: 2,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: PDF_COLORS.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  metaLine: {
    fontSize: 8,
    textAlign: "right",
    color: PDF_COLORS.ink,
    marginBottom: 1,
    lineHeight: 1.25,
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.ink,
    minHeight: 11,
  },
  /** Shared bottom strip: hairline + calm captions */
  footerHairline: {
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.borderStrong,
    paddingTop: 8,
  },
  footerCaption: {
    fontSize: 6,
    color: PDF_COLORS.inkSoft,
    marginTop: 2,
  },
  footerHint: {
    fontSize: 6,
    color: PDF_COLORS.inkSoft,
    marginTop: 4,
  },
});
