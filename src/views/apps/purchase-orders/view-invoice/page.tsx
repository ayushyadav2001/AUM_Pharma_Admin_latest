'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports


// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'

const PreviewInvoice = ({ invoiceData, id }: { invoiceData?: any; id: string }) => {
  // Handle Print Button Click
  // const handleButtonClick = () => {
  //   window.print()
  // }
  const handleButtonClick = () => {
    // Apply the landscape style before triggering print
    const style = document.createElement('style');

    style.innerHTML = `
    @media print {
      @page {
        size: A4; /* Use 'A4 landscape' for landscape orientation or 'A4' for portrait */
        margin: 1cm; /* Adjust margins as needed */
      }

      /* Additional print styles can be included here */
      body {
        font-size: 12pt; /* Adjust font size or other styles if needed */
      }
    }
  `;
    document.head.appendChild(style);

    // Trigger the print dialog
    window.print();

    // Remove the style after printing
    document.head.removeChild(style);
  };


  const handleButtonClickPDF = () => {
    // Apply the landscape style before triggering print
    const style = document.createElement('style');

    style.innerHTML = `
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
    }
  `;
    document.head.appendChild(style);

    window.print();

    // Remove the style after printing
    document.head.removeChild(style);
  };



  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        <PreviewCard invoiceData={invoiceData} id={id} />
      </Grid>
      <Grid item xs={12} md={3}>
        <PreviewActions id={id} onButtonClick={handleButtonClick} handleButtonClickPDF={handleButtonClickPDF} />
      </Grid>
    </Grid>
  )
}

export default PreviewInvoice
