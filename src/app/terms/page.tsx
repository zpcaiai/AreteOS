import type { Metadata } from "next";

export const metadata: Metadata = { title: "服务条款 · Arete" };
const VERSION = "2026-07-16";

export default function TermsPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 text-slate-200">
    <h1 className="text-3xl font-semibold">服务条款</h1><p className="mt-2 text-sm text-slate-500">版本：{VERSION}</p>
    <div className="mt-8 space-y-7 text-sm leading-7 text-slate-300">
      <section><h2 className="text-lg font-medium text-white">服务范围</h2><p>Arete 提供个人成长、决策辅助、团队协作和业务工作区工具。AI 输出可能不完整或错误，用户须独立判断并在医疗、心理、法律、财务、安全和重大经营决策中寻求合格专业人士复核。</p></section>
      <section><h2 className="text-lg font-medium text-white">账户责任</h2><p>你须提供真实有效的账户信息，保护登录凭据，不得绕过权限、攻击服务、侵犯他人权利、上传违法内容或将系统用于高风险自动化决策。发现未授权访问应立即通知运营方。</p></section>
      <section><h2 className="text-lg font-medium text-white">订阅、交付和退款</h2><p>价格、周期、税费、自动续费状态和数字商品内容以结算页为准。支付成功以支付机构签名通知为依据。上线前运营方必须在本页补充适用地区的取消、退款、发票和消费者权益规则；未补充时不得开启真实收款。</p></section>
      <section><h2 className="text-lg font-medium text-white">内容与知识产权</h2><p>你保留对所提交内容的权利，并授权 Arete 在提供服务所必需的范围内处理。模板、软件和品牌归其权利人所有。你应确保上传内容具备必要授权。</p></section>
      <section><h2 className="text-lg font-medium text-white">可用性与责任</h2><p>我们将采取合理措施保障服务，但可能因维护、网络、第三方或不可抗力中断。适用法律允许范围内，间接损失和超出已付服务费的责任受到限制；依法不得排除的责任不受影响。</p></section>
      <section><h2 className="text-lg font-medium text-white">主体、法律与争议</h2><p>正式发布前必须补充实际签约主体、地址、客服、适用法律和争议解决机构。该信息缺失时，本条款仅为产品实施草案，不构成面向客户的完整合同。</p></section>
    </div>
    <a href="/login" className="mt-10 inline-block text-indigo-300">返回 Arete</a>
  </main>;
}
