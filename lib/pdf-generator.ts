import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"

// Organization contact details
const organizationDetails = {
  name: "ScamReport Namibia",
  address: "123 Independence Avenue, Windhoek, Namibia",
  phone: "+264 61 123 4567",
  email: "scamreportnam@popya.org",
  website: "www.popya.org",
}

// Helper function to add header with logo and organization details
function addHeaderAndFooter(doc: any, title: string) {
  // Add header
  doc.setFontSize(20)
  doc.setTextColor(0, 51, 102) // Dark blue color
  doc.text(title, 14, 22)

  // Add organization details
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100) // Gray color
  doc.text(organizationDetails.name, 14, 30)
  doc.text(organizationDetails.address, 14, 35)
  doc.text(`Phone: ${organizationDetails.phone}`, 14, 40)
  doc.text(`Email: ${organizationDetails.email}`, 14, 45)
  doc.text(`Website: ${organizationDetails.website}`, 14, 50)

  // Add powered by text
  doc.setFontSize(8)
  doc.text(`Proudly powered by Popya Assistance Foundation`, 14, doc.internal.pageSize.height - 10)

  // Add date
  const currentDate = format(new Date(), "MMMM d, yyyy")
  doc.text(`Generated on: ${currentDate}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10)

  // Add horizontal line
  doc.setDrawColor(0, 51, 102) // Dark blue color
  doc.line(14, 55, doc.internal.pageSize.width - 14, 55)
}

// Export scam reports to PDF
export function exportScamReportsToPDF(reports: any[]) {
  const doc = new jsPDF()

  // Add header
  addHeaderAndFooter(doc, "Scam Reports")

  // Define the columns
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "Type", dataKey: "type" },
    { header: "Title", dataKey: "title" },
    { header: "Date", dataKey: "date" },
    { header: "Status", dataKey: "status" },
    { header: "Me Too", dataKey: "meToo" },
  ]

  // Format the data
  const data = reports.map((report) => ({
    id: report.id,
    type: report.type,
    title: report.title,
    date: typeof report.date === "string" ? report.date : format(new Date(report.created_at), "MMM d, yyyy"),
    status: report.status,
    meToo: report.meToo || 0,
  }))

  // Generate the table
  autoTable(doc, {
    startY: 60,
    columns,
    body: data,
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  return doc
}

// Export users to PDF
export function exportUsersToPDF(users: any[]) {
  const doc = new jsPDF()

  // Add header
  addHeaderAndFooter(doc, "User Report")

  // Define the columns
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "Name", dataKey: "name" },
    { header: "Email", dataKey: "email" },
    { header: "Role", dataKey: "role" },
    { header: "Verified", dataKey: "verified" },
    { header: "Joined", dataKey: "joined" },
  ]

  // Format the data
  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified ? "Yes" : "No",
    joined: typeof user.created_at === "string" ? user.created_at : format(new Date(user.created_at), "MMM d, yyyy"),
  }))

  // Generate the table
  autoTable(doc, {
    startY: 60,
    columns,
    body: data,
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  return doc
}

// Export "Me Too" data to PDF
export function exportMeTooPDF(meTooData: any[]) {
  const doc = new jsPDF()

  // Add header
  addHeaderAndFooter(doc, "Me Too Report")

  // Define the columns
  const columns = [
    { header: "Scam ID", dataKey: "scamId" },
    { header: "Scam Title", dataKey: "scamTitle" },
    { header: "Count", dataKey: "count" },
    { header: "Last Updated", dataKey: "lastUpdated" },
  ]

  // Generate the table
  autoTable(doc, {
    startY: 60,
    columns,
    body: meTooData,
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  return doc
}

// Export comments to PDF
export function exportCommentsToPDF(comments: any[]) {
  const doc = new jsPDF()

  // Add header
  addHeaderAndFooter(doc, "Comments Report")

  // Define the columns
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "Scam ID", dataKey: "scamId" },
    { header: "User", dataKey: "user" },
    { header: "Comment", dataKey: "content" },
    { header: "Date", dataKey: "date" },
  ]

  // Format the data
  const data = comments.map((comment) => ({
    id: comment.id,
    scamId: comment.scam_id,
    user: comment.user_name || "Anonymous",
    content: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : ""),
    date:
      typeof comment.created_at === "string" ? comment.created_at : format(new Date(comment.created_at), "MMM d, yyyy"),
  }))

  // Generate the table
  autoTable(doc, {
    startY: 60,
    columns,
    body: data,
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  return doc
}
