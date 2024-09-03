import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const generateInvoicePdf = async (invoiceData: any) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add a page
  const page = pdfDoc.addPage([600, 750])

  const { height } = page.getSize()

  // Set font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  // Draw the invoice title
  page.drawText('Invoice', {
    x: 50,
    y: height - 50,
    size: 30,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  })

  // Draw invoice data
  page.drawText(`Invoice Number: ${invoiceData.invoiceNumber}`, {
    x: 50,
    y: height - 100,
    size: 15,
    font: timesRomanFont
  })

  page.drawText(`Date: ${invoiceData.date}`, {
    x: 50,
    y: height - 120,
    size: 15,
    font: timesRomanFont
  })

  page.drawText(`Customer Name: ${invoiceData.customerName}`, {
    x: 50,
    y: height - 140,
    size: 15,
    font: timesRomanFont
  })

  // Draw table header
  page.drawText(`Item`, {
    x: 50,
    y: height - 180,
    size: 12,
    font: timesRomanFont
  })
  page.drawText(`Quantity`, {
    x: 200,
    y: height - 180,
    size: 12,
    font: timesRomanFont
  })
  page.drawText(`Price`, {
    x: 350,
    y: height - 180,
    size: 12,
    font: timesRomanFont
  })

  // Draw table rows
  invoiceData.items.forEach((item: any, index: number) => {
    const yPos = height - 200 - index * 20

    page.drawText(item.name, {
      x: 50,
      y: yPos,
      size: 12,
      font: timesRomanFont
    })
    page.drawText(String(item.quantity), {
      x: 200,
      y: yPos,
      size: 12,
      font: timesRomanFont
    })
    page.drawText(`$${item.price}`, {
      x: 350,
      y: yPos,
      size: 12,
      font: timesRomanFont
    })
  })

  // Draw total
  const totalYPos = height - 200 - invoiceData.items.length * 20 - 20

  page.drawText(`Total: $${invoiceData.total}`, {
    x: 50,
    y: totalYPos,
    size: 15,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  })

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
