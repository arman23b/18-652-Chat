var socket = io.connect();

$(document).ready(function() {

	setInterval(function () {
		// Reload from server (not browser cache)
		location.reload(true);
	}, 60*1000);

	updatePage();

	socket.emit('user', { 
		name : $("#authorEmail").val() 
	});

	var previousText = "";
	setInterval(function () {
		var text = $("#sentMsg").val();
		if (previousText != text) {
			socket.emit("typing", {});
		}
		previousText = text;
	}, 2*1000);	

	$("#msgButton").click(function() {
		var text = $("#sentMsg").val();
		if (text != "") {
			socket.emit('msg', { 
				text : text, 
				author : $("#author").val(),
				url : $("#url").val() });
			$('#sentMsg').val("");
		}
	});

});

socket.on('msg', function (msg) {
	var newMsg = "<li class='left clearfix'><span class='chat-img pull-left'><img class='img-circle' src='" + msg.url + "' alt='User Avatar'></span>";
	newMsg += "<div class='chat-body clearfix'><strong class='primary font'>";
	newMsg += msg.author + "</strong><small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>";
	newMsg += "<span class='time'>just now</span></small><p>" + msg.text + "</p>";	
	$('#allMsgs').append(newMsg);
	adjustScroll();
});

socket.on("update", function (data) {
	console.log("Update");
});

function updatePage() {
	adjustScroll();
	adjustTime();
}

function adjustScroll() {
	$('#body').scrollTop($('#body')[0].scrollHeight);
}

function adjustTime() {
	$('span.time').each(function () {
		var time = $(this).text();
		var millis = Date.parse(time);
		var now = new Date(); 
		var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		var currentMillis = now_utc.getTime();
		var diffMillis = currentMillis - millis;

		var diffDays = Math.floor(diffMillis / (24*3600*1000));
		if (diffDays == 1) {
			$(this).text("yesterday");
			return;
		}
		if (diffDays > 1) {
			$(this).text(diffDays + " days ago");
			return;
		}

		var diffHours = Math.floor(diffMillis / (3600*1000));
		if (diffHours == 1) {
			$(this).text("an hour ago");
			return;
		}
		if (diffHours > 1) {
			$(this).text(diffHours + " hours ago");
			return;
		}
		var diffMins = Math.floor(diffMillis / (60*1000));
		if (diffMins == 0) {
			$(this).text("just now");
			return;
		}
		if (diffMins == 1) {
			$(this).text("a minute ago");
			return;
		}
		if (diffMins > 1) {
			$(this).text(diffMins + " minutes ago");
			return;
		}
	});
}