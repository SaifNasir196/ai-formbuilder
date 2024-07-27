import { ParsedFormResponse } from "../type";

export const exportToCSV = (data: ParsedFormResponse[]) => {
  // Get all unique keys from the data
  const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  
  // Create CSV header
  const header = allKeys.join(',');
  
  // Create CSV rows
  const rows = data.map(obj => 
    allKeys.map(key => {
      let cell = obj[key as keyof ParsedFormResponse] || '';
      // Escape commas and quotes
      cell = cell.toString().replace(/"/g, '""');
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        cell = `"${cell}"`;
      }
      return cell;
    }).join(',')
  );
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n');
  
  // Create a Blob with the CSV content
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'form_responses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};  

