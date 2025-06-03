$(document).ready(function () {
    let holdCount = 0;
    let holdTypes = [];

    // Initially disable add button
    $("#add_hold_amount").prop('disabled', true);

    // Load hold types from backend
    function loadHoldTypes() {
        $.ajax({
            url: '/get_hold_types',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                holdTypes = data; // Populate hold types
                $("#add_hold_amount").prop('disabled', false); // Enable add button
            },
            error: function (err) {
                console.error('Failed to load hold types', err);
            }
        });
    }
    loadHoldTypes();

    // Add Hold Amount Field
    $("#add_hold_amount").click(function () {
        holdCount++;
        $("#hold_amount_container").append(`
          <div class="hold-amount-field" id="hold_${holdCount}">
            <select name="hold_type[]" class="hold-type-dropdown" required>
              ${generateOptions()}
            </select>
            <input type="number" step="0.01" name="hold_amount[]" placeholder="Hold Amount" required>
            <button type="button" class="remove-hold" data-id="hold_${holdCount}">X</button>
          </div>
        `);
        refreshDropdowns();
    });

    // Remove Hold Amount field
    $(document).on("click", ".remove-hold", function () {
        let id = $(this).attr("data-id");
        $("#" + id).remove();
        refreshDropdowns();
    });

    // Refresh dropdowns if value changes
    $(document).on("change", ".hold-type-dropdown", function () {
        refreshDropdowns();
    });

    // Generate dropdown options excluding selected values
    function generateOptions(selectedForThisDropdown = '') {
        let selectedValues = $("select[name='hold_type[]']").map(function () {
            return $(this).val();
        }).get();

        let options = '<option value="">Select Hold Type</option>';
        holdTypes.forEach(function (type) {
            if (!selectedValues.includes(type.hold_type) || type.hold_type === selectedForThisDropdown) {
                options += `<option value="${type.hold_type}">${type.hold_type}</option>`;
            }
        });
        return options;
    }

    // Refresh all dropdowns
    function refreshDropdowns() {
        $("select[name='hold_type[]']").each(function () {
            let currentVal = $(this).val();
            $(this).html(generateOptions(currentVal));
            $(this).val(currentVal); // Reset it back after rebuilding options
        });
    }
});