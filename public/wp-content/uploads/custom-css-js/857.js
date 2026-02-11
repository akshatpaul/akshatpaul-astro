<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">

jQuery(document).ready(function($) {
	$(document).on('click', '.elementor-popup-modal .dialog-close-button', function() {
		setTimeout(function() {
			elementorProFrontend.modules.popup.showPopup({ id: 'second_popup_show' });
		}, 500); // Adjust the delay if needed
	});
});</script>
<!-- end Simple Custom CSS and JS -->
