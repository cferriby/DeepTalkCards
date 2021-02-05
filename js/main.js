$(document).ready(function () {
	try {

	var cardContainer = document.querySelector("div.card-cont");

	for (var i = cardContainer.children.length; i >= 0; i--) {
		cardContainer.appendChild(cardContainer.children[(Math.random() * i) | 0]);
	}

	var backArray = [
		"color1",
		"color2",
		"color3",
		"color4",
		"color5",
		"color6",
		"color7",
		"color8",
	];
	for (var i = cardContainer.children.length - 1; i >= 0; i--) {
		var rand = backArray[Math.floor(Math.random() * backArray.length)];
		cardContainer.children[i].classList.add(rand);
	}

	var animating = false;
	var cardsCounter = 0;
	var numOfCards = cardContainer.children.length;
	var decisionVal = 80;
	var pullDeltaX = 0;
	var deg = 0;
	var $card, $cardNext;

	function pullChange() {
		animating = true;
		deg = pullDeltaX / 10;
		$card.css(
			"transform",
			"translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)"
		);
		$cardNext.css("opacity", 1);
	}

	function release() {
		if (pullDeltaX >= decisionVal) {
			$card.addClass("to-right");
		} else if (pullDeltaX <= -decisionVal) {
			$card.addClass("to-left");
		}

		if (Math.abs(pullDeltaX) >= decisionVal) {
			$card.addClass("inactive");

			setTimeout(function () {
				$card.addClass("below").removeClass("inactive to-left to-right");
				cardsCounter++;
				if (cardsCounter === numOfCards) {
					cardsCounter = 0;
					$(".card").removeClass("below");
				}
			}, 300);
		}

		if (Math.abs(pullDeltaX) < decisionVal) {
			$card.addClass("reset");
		}

		setTimeout(function () {
			$card
				.attr("style", "")
				.removeClass("reset")
				.find(".card__choice")
				.attr("style", "");

			pullDeltaX = 0;
			animating = false;
		}, 300);
	}

	$(document).on("mousedown touchstart", ".card:not(.inactive)", function (e) {
		if (animating) return;

		$card = $(this);
		$cardNext = $(".card__choice.m--next", $card);
		var startX = e.pageX || e.originalEvent.touches[0].pageX;

		$(document).on("mousemove touchmove", function (e) {
			var x = e.pageX || e.originalEvent.touches[0].pageX;
			pullDeltaX = x - startX;
			if (!pullDeltaX) return;
			pullChange();
		});

		$(document).on("mouseup touchend", function () {
			$(document).off("mousemove touchmove mouseup touchend");
			if (!pullDeltaX) return; // prevents from rapid click events
			release();
		});
	});

} catch(ex) {
	$(body).append(`<p>${ex.message}</p>`)
}
});
