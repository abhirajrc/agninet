$.extend(frappe.meta, {
    get_print_formats: function(doctype) {
        var print_format_list = ["Standard"];
        var default_print_format = locals.DocType[doctype].default_print_format;
        let enable_raw_printing = frappe.model.get_doc(":Print Settings", "Print Settings").enable_raw_printing;
        var print_formats = frappe.get_list("Print Format", {doc_type: doctype})
            .sort(function(a, b) { return (a > b) ? 1 : -1; });
        $.each(print_formats, function(i, d) {
            if (
                !in_list(print_format_list, d.name)
                && d.print_format_type !== 'JS'
                && (cint(enable_raw_printing) || !d.raw_printing)
            ) {
                print_format_list.push(d.name);
            }
        });
   
        if(default_print_format && default_print_format != "Standard") {
            var index = print_format_list.indexOf(default_print_format);
            print_format_list.splice(index, 1).sort();
            print_format_list.unshift(default_print_format);
        }
   
        if(frm.doc.print_format_selector){ //newly added if condition
            var print_format = [frm.doc.print_format_selector]
            return print_format
        }
        else{
            return print_format_list;
        }
    },
   });