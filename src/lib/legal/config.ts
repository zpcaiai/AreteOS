const value = (name: string, fallback: string) => process.env[name]?.trim() || fallback;

export function legalConfig() {
  return {
    entityName: value("LEGAL_ENTITY_NAME", "运营主体待确认"),
    entityAddress: value("LEGAL_ENTITY_ADDRESS", "注册地址待确认"),
    supportEmail: value("SUPPORT_EMAIL", "客服邮箱待确认"),
    privacyEmail: value("PRIVACY_EMAIL", "隐私负责人邮箱待确认"),
    governingLaw: value("GOVERNING_LAW", "适用法律待确认"),
    disputeResolution: value("DISPUTE_RESOLUTION", "争议解决机制待确认"),
    refundPolicy: value("REFUND_POLICY", "真实收款关闭；退款规则待运营主体和适用地区确认"),
    subprocessors: value("SUBPROCESSORS", "Vercel（托管）、Neon（数据库）；其他服务商待实际启用后披露"),
    dataRegions: value("DATA_REGIONS", "数据地区待运营主体确认"),
    termsVersion: value("TERMS_VERSION", "2026-07-16-draft"),
    privacyVersion: value("PRIVACY_VERSION", "2026-07-16-draft"),
  };
}
