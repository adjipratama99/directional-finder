import { pdf } from "@react-pdf/renderer";
import ReportPDF from "@/components/custom/pdf-viewer/pdf-report";
import { ReportData } from "@/types/general";
import { createElement } from "react";

export const generatePdfBlob = async (data: ReportData[]) => {
    const element = createElement(ReportPDF, { data }); // ini gantiin <ReportPDF data={data} />
    const blob = await pdf(element).toBlob();
    return blob;
};
