<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title><?php echo(APPNAME); ?></title>
		<style>
			::selection { background-color: #FFD700; color: #000; }
			body { background: blue; color: yellow; height:800px; overflow:none; }
			a { color:cyan; font-family: monospace; font-weight:bold; font-size:16px; }
			.gs-container { width: 100%; height:99%; overflow-x:none; overflow-y:auto; }
			.gs-output { width: 100%; white-space: pre-wrap; font-family: monospace; font-weight:bold; font-size:16px; overflow:none; tab-size: 4; }
			.gs-command { background: blue; color: yellow; width: 100%; font-family: monospace; font-weight:bold; font-size:16px; overflow:none; box-sizing:border-box; border:none; outline:none; }
			.gs-Content { width: 100%; overflow:none; }
			.rtlo { direction: rtl; unicode-bidi: bidi-override; }
			.rtli { text-align:right; }
			@media only screen and (max-width: 650px) { .gs-container { height: 93%; } }
			@media only screen and (max-height: 650px) { .gs-container { height: 85%; } }
		</style>
		<script src="3p/jquery-3.7.1.min.js"></script>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/hcJS_API<?php echo($g_strMinifiedSuffix); ?>.js"></script>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/hcJS<?php echo($g_strMinifiedSuffix); ?>.js"></script>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/startup<?php echo($g_strMinifiedSuffix); ?>.js"></script>
	</head>
	<body>
		<div style="width:100%; display: flex; justify-content: space-between;">
			<div class="gs-output"><?php echo(APPNAME . " " . VERSION . " - " . BUILD); ?></div>
			<div class="gs-output" style="text-align:right;"><?php echo(AUTHOR); ?></div>
		</div>
		<hr>
		<div id="ge-container" class="gs-container">
			<div class="gs-content">
				<div id="ge-output" class="gs-output"></div>
				<input type="text" autocorrect="none" autocapitalize="none" id="ge-command" class="gs-command" autofocus />
			</div>
		</div>
		<hr>
		<script src="js<?php echo(RELEASEDIRSUFFIX); ?>/startup<?php echo($g_strMinifiedSuffix); ?>.js"</script>
	</body>
</html>
