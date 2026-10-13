import React, { useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  htmlContent: string;
  plainTextSummary: string;
  fileName?: string;
  onDownloadPdf?: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  htmlContent,
  plainTextSummary,
  fileName = 'derote-insight-report',
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePdfClick = async () => {
    setPrintError(null);
    if (onDownloadPdf) {
      setIsPdfGenerating(true);
      try {
        await Promise.resolve(onDownloadPdf());
      } catch (err) {
        console.error('PDF generation error:', err);
        setPrintError('Could not generate PDF document. Please try the HTML download option.');
      } finally {
        setIsPdfGenerating(false);
      }
    } else {
      handleBrowserPrint();
    }
  };

  const handleBrowserPrint = () => {
    setPrintError(null);
    try {
      window.print();
    } catch (err) {
      console.warn('Browser window.print() failed:', err);
      setPrintError(
        'Browser printing is restricted inside this preview frame. Use "Download PDF Report" or "Download HTML Report" below to save with full fidelity.'
      );
    }
  };

  const handleDownloadHtml = () => {
    try {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — DeRote</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #102C46;
      background: #FFFFFF;
      margin: 0;
      padding: 32px 40px;
      line-height: 1.5;
    }
    .report-container {
      max-width: 820px;
      margin: 0 auto;
    }
    .header-bar {
      border-bottom: 2px solid #0866C6;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #062B50;
      margin: 0;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0866C6;
      background: #E8F3FF;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .card {
      background: #F8FAFD;
      border: 1px solid #D5E9FF;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: #062B50;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .card-text {
      font-size: 13px;
      color: #465B72;
      margin: 0 0 10px 0;
      line-height: 1.6;
    }
    .evidence {
      font-size: 11px;
      color: #0866C6;
      font-weight: 600;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: #FFFFFF;
      border: 1px solid #E8F3FF;
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }
    .stat-val {
      font-size: 22px;
      font-weight: 800;
      color: #062B50;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: #64778C;
      text-transform: uppercase;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #E8F3FF;
      font-size: 11px;
      color: #64778C;
      text-align: center;
    }
    @media print {
      body { padding: 12mm 15mm; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="no-print" style="margin-bottom: 20px; padding: 12px 16px; background: #E8F3FF; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; font-weight: 600; color: #0866C6;">Ready for printing or PDF export</span>
      <button onclick="window.print()" style="background: #0866C6; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px;">Print Now (Ctrl+P / Cmd+P)</button>
    </div>
    ${htmlContent}
    <div class="footer">
      <span>DeRote Student Insight System · Reflective Guidance Documentation · Confidential & Non-Evaluative</span>
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainTextSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = plainTextSummary;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#062B50]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8F3FF] z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#F0F5FA] flex items-start justify-between gap-4 bg-[#FAFCFF]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0866C6] bg-[#E8F3FF] px-2.5 py-0.5 rounded-full">
                Document Export & Print
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#64778C] mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F4F8FD] border-b border-[#E8F3FF] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePdfClick}
              disabled={isPdfGenerating}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0866C6] text-white font-bold text-xs hover:bg-[#062B50] active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-70 whitespace-nowrap"
              title="Download high-resolution official PDF document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isPdfGenerating ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleBrowserPrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#062B50] hover:text-[#0866C6] border border-[#D5E9FF] font-semibold text-xs hover:bg-[#F8FAFD] active:scale-[0.98] transition-all shadow-xs cursor-pointer whitespace-nowrap"
              title="Trigger browser print or system save"
            >
              <Printer className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>Print Dialog</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#465B72] hover:text-[#062B50] border border-[#E8F3FF] font-semibold text-xs hover:bg-[#F8FAFD] transition-colors cursor-pointer"
              title="Download standalone HTML file with full styling"
            >
              <FileText className="w-3.5 h-3.5 text-[#0866C6]" />
              <span>HTML File</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-[#465B72] hover:text-[#062B50] border border-[#E8F3FF] font-semibold text-xs hover:bg-[#F8FAFD] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Summary Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#0866C6]" />
                <span>Copy Summary Text</span>
              </>
            )}
          </button>
        </div>

        {/* Error / Notice banner if browser print was blocked in iframe */}
        {printError && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{printError}</span>
          </div>
        )}

        {/* Document Preview Pane */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#F9FBFE]">
          <div className="bg-white rounded-2xl p-6 border border-[#E8F3FF] shadow-xs text-left">
            <div
              className="report-preview-content space-y-4"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0F5FA] bg-[#FAFCFF] flex items-center justify-between text-xs text-[#64778C]">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0866C6]" />
            <span>Ready for printing, official sharing, or student portfolios</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#E8F3FF] bg-white hover:bg-[#F4F8FD] text-[#062B50] font-semibold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
