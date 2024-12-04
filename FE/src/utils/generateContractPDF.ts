import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { timesnewromanBase64 } from "./Base64";
import { timesnewromanitalicBase64 } from "./ItalicBase64";
import { IContract } from "../interfaces";

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

export const downloadContractPDF = (contract: IContract) => {
  const doc = new jsPDF("p", "mm", "a4", true);

  doc.addFileToVFS("Times-New-Roman.ttf", timesnewromanBase64);
  doc.addFileToVFS("Times-New-Roman-Italic.ttf", timesnewromanitalicBase64);
  doc.addFont("Times-New-Roman-Italic.ttf", "Times New Roman", "italic");
  doc.setFont("Times New Roman", "italic");
  doc.addFont("Times-New-Roman.ttf", "Times New Roman", "normal");
  doc.setFont("Times New Roman", "normal");


  // Tiêu đề
  doc.setFontSize(12);
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 105, 10, { align: "center" });
  doc.text("Độc lập - Tự do - Hạnh phúc", 105, 20, { align: "center" });
  doc.text("-------------o0o-------------", 105, 25, { align: "center" });

  doc.setFontSize(18);
  doc.text("HỢP ĐỒNG THUÊ NHÀ", 105, 40, { align: "center" });

  // Ngày tháng
  const currentDate = moment().format("DD [tháng] MM [năm] YYYY");
  doc.setFontSize(12);
  addWrappedText(
    doc,
    `Hôm nay, ngày ${currentDate}, tại TP Hà Nội, chúng tôi gồm:`,
    20,
    60,
    170,
    6
  );

  // Bên cho thuê
  doc.setFontSize(14);
  doc.text("I – BÊN CHO THUÊ (Bên A):", 20, 70);
  doc.setFontSize(12);
  doc.text("1. Ông/Bà (chủ sở hữu ngôi nhà): ", 30, 80);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.innkeeper.name}`, 90, 80);
  doc.setFont("Times New Roman", "normal");
  doc.text("Đia chỉ: ", 40, 90);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.address}`, 60, 90);

  // Bên thuê
  doc.setFontSize(14);
  doc.text("II – BÊN THUÊ (Bên B):", 20, 130);
  doc.setFontSize(12);
  doc.text("1. Ông/Bà: ", 30, 140);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.tenant.name}`, 50, 140);
  doc.setFont("Times New Roman", "normal");
  doc.text("CCCD số: ", 30, 150);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.tenant.idCard}`, 60, 150);
  doc.setFont("Times New Roman", "normal");
  doc.text("Điện thoại: ", 30, 160);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.tenant.phone}`, 60, 160);
  doc.setFont("Times New Roman", "normal");
  doc.text("Email: ", 30, 170);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.tenant.email}`, 50, 170);
  doc.setFont("Times New Roman", "normal");
  doc.text("Địa chỉ: ", 30, 180);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.tenant.address}`, 50, 180);

  // Điều khoản hợp đồng
  doc.setFontSize(12);
  addWrappedText(
    doc,
    "Sau khi bàn bạc, hai bên đã thống nhất ký kết hợp đồng thuê nhà với các điều khoản sau:",
    20,
    200,
    170,
    6
  );

  doc.setFontSize(14);
  addWrappedText(
    doc,
    `Điều 1: Bên A đồng ý cho Bên B thuê phòng trọ số `,
    20,
    220,
    170,
    6
  );
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.room.roomName}`, 125, 220);
  doc.setFont("Times New Roman", "normal");

  doc.setFontSize(14);
  doc.text("Điều 2: Thời hạn hợp đồng:", 20, 240);
  doc.setFontSize(12);
  addWrappedText(
    doc,
    `- Bên A đồng ý cho Bên B thuê với thời gian bắt đầu từ ngày `,
    30,
    250,
    170,
    6
  );
  doc.setFont("Times New Roman", "italic");
  doc.text(`${moment(contract.startDate).format("DD/MM/YYYY")}`, 135, 250);
  doc.setFont("Times New Roman", "normal");
  addWrappedText(doc, ` đến ngày `, 30, 255, 170, 6);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${moment(contract.endDate).format("DD/MM/YYYY")}`, 50, 255);
  doc.setFont("Times New Roman", "normal");
  doc.addPage();
  addWrappedText(
    doc,
    "- Hết thời hạn trên, nếu Bên B còn có nhu cầu thuê và Bên A chưa có nhu cầu sử dụng thì Bên A đồng ý ký hợp đồng tiếp dựa trên các điều khoản thoả thuận mới.",
    30,
    30,
    170,
    6
  );
  addWrappedText(
    doc,
    "- Nếu bên nào muốn chấm dứt hợp đồng trong khi hợp đồng còn hiệu lực thì phải thông báo cho bên kia trước 01 tháng.",
    30,
    45,
    170,
    6
  );

  doc.setFontSize(14);
  doc.text("Điều 3: Giá và phương thức thanh toán:", 20, 60);
  doc.setFontSize(12);
  doc.text(`- Đơn giá cho thuê là: `, 30, 70);
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.room.price.toLocaleString("vi-VN")} VND.`, 70, 70);
  doc.setFont("Times New Roman", "normal");
  addWrappedText(
    doc,
    `- Đơn giá trên có giá trị trong năm ${moment(contract.startDate).format(
      "YYYY"
    )}, sau thời hạn này giá thuê sẽ theo giá thị trường.`,
    30,
    80,
    170,
    6
  );
  doc.text("- Phương thức thanh toán: Chuyển khoản hoặc tiền mặt.", 30, 90);
  addWrappedText(
    doc,
    `- Đặt cọc: Bên B đặt cọc cho bên A bằng giá trị 1 tháng thuê nhà, tức là `,
    30,
    100,
    170,
    6
  );
  doc.setFont("Times New Roman", "italic");
  doc.text(`${contract.depositAmount.toLocaleString("vi-VN")} VND`, 155, 100);
  doc.setFont("Times New Roman", "normal");
  addWrappedText(
    doc,
    "- Thời gian thanh toán: Thanh toán tiền nhà theo tháng/lần, trong vòng 5 ngày đầu tháng của tháng đầu chu kỳ thanh toán.",
    30,
    115,
    170,
    6
  );

  doc.setFontSize(14);
  doc.text("Điều 4: Trách nhiệm của bên A", 20, 130);
  doc.setFontSize(12);
  addWrappedText(
    doc,
    "- Giao nhà cho bên thuê nhà theo đúng thời hạn và hiện trạng đã thoả thuận trong hợp đồng này.",
    30,
    140,
    170,
    6
  );
  doc.text(
    "- Phối hợp với bên B để giải quyết các tranh chấp hợp đồng nếu có.",
    30,
    155
  );
  doc.text(
    "- Hỗ trợ các thủ tục cần thiết để bên thuê tiến hành tiếp quản nhà được thuận lợi.",
    30,
    165
  );
  addWrappedText(
    doc,
    "- Cùng phối hợp đảm bảo an ninh trật tự, công tác an toàn phòng chống cháy nổ, thiên tai, dịch bệnh theo quy định của pháp luật và địa phương.",
    30,
    175,
    170,
    6
  );
  addWrappedText(
    doc,
    "- Cùng phối hợp đảm bảo an ninh trật tự, công tác an toàn phòng chống cháy nổ, thiên tai, dịch bệnh theo quy định của pháp luật và địa phương.",
    30,
    175,
    170,
    6
  );

  doc.setFontSize(14);
  doc.text("Điều 5: Trách nhiệm của bên B", 20, 190);
  doc.setFontSize(12);
  addWrappedText(
    doc,
    "- Sử dụng đúng mục đích thuê nhà theo hợp đồng, không được chuyển nhượng sang cho bên khác khi không có sự đồng ý của bên A.",
    30,
    200,
    170,
    6
  );
  doc.text("- Bảo quản tốt các tài sản bên cho thuê bàn giao.", 30, 215);
  doc.text("- Ở đúng số người đã đăng ký với bên A.", 30, 225);
  doc.text(
    "- Giữ gìn vệ sinh chung, trật tự an ninh xã hội, không gây mất trật tự công cộng.",
    30,
    235
  );
  doc.text("- Thanh toán chi phí điện, nước và các dịch vụ khác.", 30, 245);
  doc.text("- Trả tiền thuê nhà theo đúng thời hạn.", 30, 255);

  doc.setFontSize(14);
  doc.text("Điều 6: Điều khoản chấm dứt hợp đồng", 20, 265);
  doc.setFontSize(12);
  addWrappedText(
    doc,
    "6.1 Việc chấm dứt hợp đồng dưới bất cứ hình thức nào phải được thực hiện bằng văn bản trước thời điểm chấm dứt hợp đồng 1 tháng.",
    30,
    275,
    170,
    6
  );
  doc.addPage();
  addWrappedText(
    doc,
    "- Nếu bên nào muốn chủ động chấm dứt hợp đồng trước thời hạn sẽ phải đền bù 1 tháng tiền thuê tương đương.",
    30,
    30,
    170,
    6
  );

  doc.text(
    "6.2 Chấm dứt hợp đồng do cố tình vi phạm điều khoản chấm dứt hợp đồng:",
    30,
    45
  );
  addWrappedText(
    doc,
    "- Nếu Bên B không thực hiện được trách nhiệm thanh toán tiền thuê nhà, bên A có quyền đòi lại căn nhà cho thuê, và phạt bên B số tiền tương ứng.",
    30,
    55,
    170,
    6
  );
  addWrappedText(
    doc,
    "- Nếu Bên B không thực hiện được trách nhiệm thanh toán tiền thuê nhà, bên A có quyền đòi lại căn nhà cho thuê, và phạt bên B số tiền tương ứng.",
    30,
    55,
    170,
    6
  );

  doc.setFontSize(14);
  doc.text("Điều 7: Điều khoản chung", 20, 70);
  doc.setFontSize(12);
  addWrappedText(
    doc,
    "- Hết hạn hợp đồng nếu Bên B không thuê tiếp thì phải báo với Bên A trước lúc hết hạn 01 tháng.",
    30,
    80,
    170,
    6
  );
  addWrappedText(
    doc,
    "- Trước khi kết thúc hợp đồng, Bên B có trách nhiệm thanh toán hết các chi phí sử dụng hạ tầng bên B đã sử dụng khi hợp đồng còn giá trị.",
    30,
    95,
    170,
    6
  );
  doc.text("- Hai bên có trách nhiệm thực hiện đúng hợp đồng này.", 30, 110);
  addWrappedText(
    doc,
    "- Mọi thay đổi bổ sung điều khoản hợp đồng này phải lập thành văn bản có chữ ký của cả hai bên.",
    30,
    120,
    170,
    6
  );
  doc.text("- Hợp đồng này có hiệu lực kể từ ngày ký.", 30, 135);

  // Xác nhận của bên A và bên B
  doc.text(
    "Xác nhận của bên A:                                                        Xác nhận của bên B:",
    20,
    230
  );
  doc.text(
    `Ký tên: ________________                                              Ký tên: ________________`,
    20,
    240
  );

  // Lưu file PDF
  doc.save(`contract_${contract._id}.pdf`);
};

export default downloadContractPDF;
