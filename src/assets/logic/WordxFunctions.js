import { TableRow, TableCell, Paragraph } from "docx";
//
export class Design {
  constructor(data) {
    this.nbs = data;
  }
  // Table generator function
  table(r = 1) {
    const rows = [];
    const customRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("0,0")],
        }),
        new TableCell({
          children: [new Paragraph("0,1")],
        }),
        new TableCell({
          children: [new Paragraph("0,2")],
        }),
        new TableCell({
          children: [new Paragraph("0,3")],
        }),
      ],
    });
    for (let i = 0; i < r; i++) {
      rows.push(customRow);
    }

    return rows;
  }
}
