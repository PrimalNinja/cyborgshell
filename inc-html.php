<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title><?php echo(APPNAME); ?></title>
		
		<link href="3p/bootstrap.min.css" rel="stylesheet">
		<link href="3p/jquery-ui.css" rel="stylesheet">
		<link href="3p/jquery.ui.rotatable.css" rel="stylesheet">

		<link href="css<?php echo(RELEASEDIRSUFFIX); ?>/shell.css" rel="stylesheet">

		<script src="3p/jquery-3.7.1.min.js"></script>
		<script src="3p/jquery-ui-1.13.2.min.js"></script>
		<script src="3p/jquery.ui.rotatable.min.js"></script>

		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/cyborgShell_API<?php echo($g_strMinifiedSuffix); ?>.js"></script>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/cyborgShell<?php echo($g_strMinifiedSuffix); ?>.js"></script>
	</head>
	<body>
		<!-- Existing header stays the same -->
		<div id="ge-clititlebar" style="width:100%; display: flex; justify-content: space-between;">
			<div class="gs-clioutput"><?php echo(APPNAME . " " . VERSION); ?></div>
			<div class="gs-clioutput" style="text-align:right;"><?php echo(AUTHOR); ?></div>
		</div>
		<hr>
		
		<!-- OCR container (was missing) -->
		<div id="ocr-container" class="gs-ocr-container"></div>
		
		<!-- RESTORE ORIGINAL: Existing desktop container -->
		<div id="ge-clidesktop" class="gs-clidesktop">	<!-- forms go in here -->
			<div id="ge-clicontainer" class="gs-clicontainer">	<!-- CLI container -->
				<div class="gs-clicontent">
					<div id="ge-clioutput" class="gs-clioutput"></div>
					<input type="email" autocorrect="none" autocapitalize="none" id="ge-clicommand" class="gs-clicommand" autofocus />
				</div>
			</div>
		</div>
		<hr>
		<div class="ge-clitaskbar gs-clitaskbar">By your command...</div>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/startup<?php echo($g_strMinifiedSuffix); ?>.js"></script>
	</body>
</html>
