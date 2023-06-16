# Copyright (c) 2023, Abhiraaj R C and contributors
# For license information, please see license.txt
import os

from PyPDF2 import PdfWriter


import frappe
from frappe.model.document import Document
from frappe import _
from frappe.core.doctype.access_log.access_log import make_access_log
from frappe.translate import print_language
from frappe.utils.pdf import get_pdf
from frappe.utils.print_format import read_multi_pdf

class PO(Document):
	@frappe.whitelist()
	def frm_call(self, msg):
		import time
		time.sleep(5)
		frappe.msgprint(msg)

		# return "This message is from frm.call"

	@frappe.whitelist()
	def download_multi_pdf(self,
		doctype, name, format=None, no_letterhead=False, letterhead=None, options=None):


		import json

		output = PdfWriter()

		if isinstance(options, str):
			options = json.loads(options)

		if not isinstance(doctype, dict):
			result = json.loads(name)

			# Concatenating pdf files
			for i, ss in enumerate(result):
				output = frappe.get_print(
					i,
					ss,
					format,
					as_pdf=True,
					output=output,
					no_letterhead=no_letterhead,
					letterhead=letterhead,
					pdf_options=options,
				)
			frappe.local.response.filename = "{doctype}.pdf".format(
				doctype=doctype.replace(" ", "-").replace("/", "-")
			)
		else:
			for doctype_name in doctype:
				for doc_name in doctype[doctype_name]:
					try:
						output = frappe.get_print(
							doctype_name,
							doc_name,
							format,
							as_pdf=True,
							output=output,
							no_letterhead=no_letterhead,
							letterhead=letterhead,
							pdf_options=options,
						)
					except Exception:
						frappe.log_error(
							title="Error in Multi PDF download",
							message=f"Permission Error on doc {doc_name} of doctype {doctype_name}",
							reference_doctype=doctype_name,
							reference_name=doc_name,
						)
			frappe.local.response.filename = f"{name}.pdf"

		frappe.local.response.filecontent = read_multi_pdf(output)
		frappe.local.response.type = "download"
