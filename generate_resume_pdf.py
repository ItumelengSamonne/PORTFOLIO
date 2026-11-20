"""Generate a classic-style ATS-friendly CV PDF for Itumeleng Molefi Samonne.

Run from the portfolio folder:
    python generate_resume_pdf.py

Output: assets/itumeleng-resume.pdf  (classic single-column CV, Letter size)

Requires:  pip install reportlab
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_LEFT

OUT = "assets/itumeleng-resume.pdf"

styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=18,
    leading=20, spaceAfter=2, textColor=colors.HexColor("#0b1220"))
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"], fontName="Helvetica", fontSize=10.5,
    leading=12, spaceAfter=4, textColor=colors.HexColor("#475569"))
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5,
    leading=10, spaceAfter=8, textColor=colors.HexColor("#475569"))
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11,
    leading=13, spaceBefore=8, spaceAfter=3, textColor=colors.HexColor("#1d4ed8"))
entry_title_style = ParagraphStyle(
    "EntryTitle", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10,
    leading=11.5, spaceAfter=0, textColor=colors.HexColor("#0b1220"))
entry_org_style = ParagraphStyle(
    "EntryOrg", parent=styles["Normal"], fontName="Helvetica", fontSize=9,
    leading=10.5, spaceAfter=2, textColor=colors.HexColor("#64748b"))
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5,
    leading=12, spaceAfter=3, textColor=colors.HexColor("#1e293b"))
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style, leftIndent=12, firstLineIndent=-8,
    spaceAfter=1)

doc = SimpleDocTemplate(OUT, pagesize=letter,
                       leftMargin=0.7*inch, rightMargin=0.7*inch,
                       topMargin=0.5*inch, bottomMargin=0.5*inch)

story = []

# Header
story.append(Paragraph("Itumeleng Molefi Samonne", name_style))
story.append(Paragraph("Data Science Student | Front-End Developer", role_style))
story.append(Paragraph(
    "Kimberley, Northern Cape, ZA  |  itumelengmosesane22@gmail.com  |  +27 64 702 9667",
    contact_style))
story.append(Paragraph(
    "github.com/Paska465  |  linkedin.com/in/itumeleng-samonne-3x7", contact_style))
story.append(HRFlowable(width="100%", thickness=1.2, color=colors.HexColor("#1d4ed8"),
                        spaceAfter=8))

# Summary
story.append(Paragraph("SUMMARY", section_style))
story.append(Paragraph(
    "First-year Data Science student at Sol Plaatje University with strong, practical skills in "
    "Microsoft Excel, Access, Word and PowerPoint (from Computer Applications Technology in high "
    "school) and growing skills in Python, SQL, statistics, probability, calculus, algebra, C++, "
    "and R (tidyverse). Writes hand-crafted HTML, CSS and JavaScript. Open to internships, "
    "part-time work and small freelance projects in data cleaning, Excel/Access builds, dashboards "
    "and web pages.", body_style))

# Education
story.append(Paragraph("EDUCATION", section_style))

story.append(Paragraph("BSc Data Science - First Year (complete)", entry_title_style))
story.append(Paragraph("Sol Plaatje University, Kimberley  |  Feb 2026 - Nov 2026",
                      entry_org_style))
for b in [
    "Semester 1: BCA511, NMAT515, SCOR511, NIAP513, NSTA515.",
    "Semester 2: NMAT514, SCOR612, NDAS512, NDSA512, NAPM512, NSTA514.",
    "All 11 first-year modules passed.",
]:
    story.append(Paragraph("- " + b, bullet_style))

story.append(Paragraph("National Senior Certificate", entry_title_style))
story.append(Paragraph("Pinagare High School  |  2021 - 2025", entry_org_style))
story.append(Paragraph(
    "Subjects: Setswana (HL), English (FAL), Mathematics, Life Orientation, Computer Applications "
    "Technology (CAT), Life Science, Physical Science. CAT covered word processing, spreadsheets, "
    "databases and presentations.", body_style))

story.append(Paragraph("Primary schooling", entry_title_style))
story.append(Paragraph("Sacred Heart Private Primary School  |  2014 - 2020", entry_org_style))

# Skills
story.append(Paragraph("SKILLS", section_style))
from reportlab.platypus import Table, TableStyle
skills = [
    ("Microsoft Excel", "Strong"), ("Microsoft Access", "Strong"),
    ("Microsoft Word", "Strong"), ("PowerPoint", "Strong"),
    ("HTML & semantics", "Strong"), ("CSS & responsive layout", "Comfortable"),
    ("C++", "Comfortable"), ("R (tidyverse)", "Comfortable"),
    ("Git & GitHub", "Comfortable"), ("Python", "Learning"),
    ("SQL", "Learning"), ("JavaScript", "Learning"),
    ("Linux", "Learning"), ("Statistics & probability", "Comfortable"),
    ("Calculus & algebra", "Comfortable"), ("Data structures & algorithms", "Comfortable"),
]
skill_rows = []
for i in range(0, len(skills), 2):
    left = skills[i]
    right = skills[i + 1] if i + 1 < len(skills) else ("", "")
    skill_rows.append([
        Paragraph(f"{left[0]}  -  {left[1]}", body_style),
        Paragraph(f"{right[0]}  -  {right[1]}" if right[0] else "", body_style),
    ])
skill_table = Table(skill_rows, colWidths=[3.3*inch, 3.3*inch])
skill_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
]))
story.append(skill_table)

# Projects
story.append(Paragraph("PROJECTS", section_style))

story.append(Paragraph("Project One - data analysis (placeholder)", entry_title_style))
story.append(Paragraph("Personal  |  2026", entry_org_style))
story.append(Paragraph(
    "Clean a messy dataset, explore it, present one clear finding. Tools: Python, Pandas, Jupyter.",
    body_style))

story.append(Paragraph("Project Two - Access database (placeholder)", entry_title_style))
story.append(Paragraph("Personal  |  2026", entry_org_style))
story.append(Paragraph(
    "Access/Excel workbook solving a real problem (forms, queries, reports). Tools: Access, Excel, SQL.",
    body_style))

story.append(Paragraph("Project Three - web page (placeholder)", entry_title_style))
story.append(Paragraph("Personal  |  2026", entry_org_style))
story.append(Paragraph(
    "Small accessible web page built by hand. Tools: HTML, CSS, JavaScript.", body_style))

# Additional
story.append(Paragraph("ADDITIONAL", section_style))
story.append(Paragraph(
    "Location: Kimberley, Northern Cape (base); also Taung (NW) and Johannesburg/Pretoria.",
    body_style))
story.append(Paragraph("Languages: English, Setswana.   Interests: Linux (Fedora), open source, data visualisation.",
                      body_style))
story.append(Paragraph("References available on request.", body_style))

doc.build(story)
print(f"Created {OUT}")