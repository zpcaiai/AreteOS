import type { Metadata } from "next";

export const metadata: Metadata = { title: "隐私政策 · Arete" };
const VERSION = "2026-07-16";

export default function PrivacyPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 text-slate-200">
    <h1 className="text-3xl font-semibold">隐私政策</h1><p className="mt-2 text-sm text-slate-500">版本：{VERSION}</p>
    <div className="mt-8 space-y-7 text-sm leading-7 text-slate-300">
      <section><h2 className="text-lg font-medium text-white">我们处理什么数据</h2><p>账户资料、你主动填写的成长与业务工作区内容、产品使用事件、AI 对话上下文、订阅及订单状态，以及保障安全所需的会话、设备和经脱敏处理的网络标识。支付卡或钱包密钥由支付机构处理，Arete 不保存。</p></section>
      <section><h2 className="text-lg font-medium text-white">为什么处理</h2><p>用于提供、同步和改进工作区；生成你主动请求的 AI 建议；完成订阅与数字商品交付；防止滥用、排查故障并履行法定义务。健康与心理相关模块不用于诊断、急救或替代专业服务。</p></section>
      <section><h2 className="text-lg font-medium text-white">共享与跨境</h2><p>仅向运行产品所必需的云托管、数据库、邮件、监控、AI 模型和支付服务商传递最少数据。正式上线前，运营方须在本页补充实际服务商、数据地区、主体名称和联系方式，并按适用法律完成跨境评估。</p></section>
      <section><h2 className="text-lg font-medium text-white">保留与安全</h2><p>账户存续期间保留工作区数据；安全日志按运营保留计划限期保存；依法必须保留的交易凭证按法定期限处理。我们采用加密传输、可撤销会话、最小权限、访问审计和备份恢复控制，但任何系统都无法承诺绝对安全。</p></section>
      <section><h2 className="text-lg font-medium text-white">你的权利</h2><p>账户页可导出全部用户归属数据、清除 AI 记忆或永久删除账户。你还可请求访问、更正、限制处理或撤回同意。永久删除不可恢复；依法需保留的记录将隔离并仅用于合规目的。</p></section>
      <section><h2 className="text-lg font-medium text-white">未成年人和联系</h2><p>本服务不面向未满 18 周岁用户。上线前必须在此填写运营主体、注册地址、隐私负责人邮箱与投诉渠道；缺少这些信息时不得作为公开付费服务发布。</p></section>
    </div>
    <a href="/login" className="mt-10 inline-block text-indigo-300">返回 Arete</a>
  </main>;
}
