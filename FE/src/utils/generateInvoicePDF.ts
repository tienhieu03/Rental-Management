import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { IInvoice } from "../interfaces";

const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const splitText = doc.splitTextToSize(text, maxWidth);
  splitText.forEach((line: string, index: number) => {
    doc.text(line, x, y + index * lineHeight);
  });
};

export const downloadInvoicePDF = (invoice: IInvoice) => {
  const doc = new jsPDF("p", "mm", "a4", true);

  // Tiêu đề
  doc.setFontSize(12);
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 105, 10, { align: "center" });
  doc.text("Độc lập - Tự do - Hạnh phúc", 105, 20, { align: "center" });
  doc.text("-------------o0o-------------", 105, 25, { align: "center" });

  doc.setFontSize(18);
  doc.text("HÓA ĐƠN THANH TOÁN", 105, 40, { align: "center" });

  // Ngày tháng
  const currentDate = moment().format("DD [tháng] MM [năm] YYYY");
  doc.setFontSize(12);
  addWrappedText(
    doc,
    `Hôm nay, ngày ${currentDate}, chúng tôi gồm:`,
    20,
    60,
    170,
    6
  );

  // Thông tin người thuê
  doc.setFontSize(14);
  doc.text("I – THÔNG TIN NGƯỜI THUÊ:", 20, 70);
  doc.setFontSize(12);
  doc.text("1. Ông/Bà: ", 30, 80);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.tenant.name}`, 60, 80);
  doc.setFont("Times New Roman", "normal");
  doc.text("CCCD số: ", 30, 90);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.tenant.idCard}`, 60, 90);
  doc.setFont("Times New Roman", "normal");
  doc.text("Điện thoại: ", 30, 100);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.tenant.phone}`, 60, 100);
  doc.setFont("Times New Roman", "normal");
  doc.text("Email: ", 30, 110);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.tenant.email}`, 60, 110);

  // Thông tin hóa đơn
  doc.setFontSize(14);
  doc.text("II – THÔNG TIN HÓA ĐƠN:", 20, 130);
  doc.setFontSize(12);
  doc.text("1. Phòng: ", 30, 140);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.room.roomName}`, 60, 140);
  doc.setFont("Times New Roman", "normal");
  doc.text("2. Dịch vụ: ", 30, 150);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.service.name}`, 60, 150);
  doc.setFont("Times New Roman", "normal");
  doc.text("3. Đơn giá: ", 30, 160);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.service.priceUnit.toLocaleString()} đ/${invoice.service.unit}`, 60, 160);
  doc.setFont("Times New Roman", "normal");
  doc.text("4. Chỉ số đầu: ", 30, 170);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.firstIndex}`, 60, 170);
  doc.setFont("Times New Roman", "normal");
  doc.text("5. Chỉ số cuối: ", 30, 180);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.finalIndex}`, 60, 180);
  doc.setFont("Times New Roman", "normal");
  doc.text("6. Tổng số: ", 30, 190);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.totalNumber}`, 60, 190);
  doc.setFont("Times New Roman", "normal");
  doc.text("7. Thành tiền: ", 30, 200);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.amount.toLocaleString()} đ`, 60, 200);
  doc.setFont("Times New Roman", "normal");
  doc.text("8. Tháng: ", 30, 210);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.month}`, 60, 210);
  doc.setFont("Times New Roman", "normal");
  doc.text("9. Trạng thái: ", 30, 220);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${invoice.status}`, 60, 220);

  // Xác nhận của bên thuê
  doc.text(
    "Xác nhận của bên thuê:",
    20,
    250
  );
  doc.text(
    `Ký tên: ________________`,
    20,
    260
  );

  // Lưu file PDF
  doc.save(`invoice_${invoice._id}.pdf`);
};

export default downloadInvoicePDF;