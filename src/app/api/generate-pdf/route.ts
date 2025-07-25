import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { reportData, reportHTML } = await request.json()

    // Create a more comprehensive HTML document for PDF generation
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Medical Analysis Report - ${reportData.analysis.structured.name}</title>
          <style>
            @page {
              margin: 1in;
              size: A4;
            }
            
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif; 
              background: white;
              color: #333;
              font-size: 12px;
              line-height: 1.4;
            }
            
            .print-content {
              font-family: 'Arial', sans-serif;
              max-width: 100%;
              margin: 0;
              padding: 0;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
              page-break-after: avoid;
            }
            
            .app-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            
            .report-title {
              font-size: 18px;
              color: #374151;
              margin-bottom: 10px;
            }
            
            .report-date {
              font-size: 12px;
              color: #6b7280;
            }
            
            .section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 2px solid #e5e7eb;
              page-break-after: avoid;
            }
            
            .patient-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            
            .info-item {
              background: #f9fafb;
              padding: 12px;
              border-radius: 6px;
              border-left: 4px solid #2563eb;
              break-inside: avoid;
            }
            
            .info-label {
              font-weight: bold;
              color: #374151;
              margin-bottom: 4px;
              font-size: 11px;
            }
            
            .info-value {
              color: #1f2937;
              font-size: 12px;
            }
            
            .list-item {
              background: #f3f4f6;
              padding: 8px 12px;
              margin-bottom: 6px;
              border-radius: 4px;
              border-left: 3px solid #6b7280;
              break-inside: avoid;
              font-size: 11px;
            }
            
            .symptoms-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }
            
            .triage-level {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 15px;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 10px;
            }
            
            .triage-urgent {
              background: #fef3c7;
              color: #92400e;
              border: 2px solid #f59e0b;
            }
            
            .triage-emergency {
              background: #fee2e2;
              color: #991b1b;
              border: 2px solid #ef4444;
            }
            
            .triage-normal {
              background: #d1fae5;
              color: #065f46;
              border: 2px solid #10b981;
            }
            
            .admission-required {
              background: #fee2e2;
              color: #991b1b;
              padding: 12px;
              border-radius: 6px;
              border: 2px solid #ef4444;
              font-weight: bold;
              text-align: center;
              margin: 12px 0;
              font-size: 12px;
            }
            
            .diseases-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            
            .disease-tag {
              background: #ede9fe;
              color: #5b21b6;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              border: 1px solid #c4b5fd;
            }
            
            .disclaimer {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              padding: 15px;
              border-radius: 6px;
              margin-top: 25px;
              text-align: center;
              page-break-inside: avoid;
            }
            
            .disclaimer-title {
              font-weight: bold;
              color: #92400e;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .disclaimer-text {
              color: #78350f;
              font-size: 11px;
              line-height: 1.4;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 10px;
              page-break-inside: avoid;
            }
            
            @media print {
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          ${reportHTML}
        </body>
      </html>
    `

    // Use Puppeteer or similar to generate PDF
    // For now, we'll use a simple approach with the browser's built-in PDF generation
    const response = await fetch("https://api.htmlcsstoimage.com/v1/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HTML_CSS_TO_IMAGE_API_KEY}`, // You'll need to get this API key
      },
      body: JSON.stringify({
        html: fullHTML,
        format: "pdf",
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate PDF")
    }

    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SonicScribe-Medical-Report-${reportData.analysis.structured.name.replace(/\s+/g, "-")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
