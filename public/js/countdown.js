
    // Set the target date and time for the countdown
    const countDownDate = new Date("Jul 31, 2026 23:59:59").getTime();

    // Update the countdown every second
    const countdownInterval = setInterval(function () {
      const now = new Date().getTime();
      const timeRemaining = countDownDate - now;

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Display the result in the element with id="timer"
      document.getElementById("timer").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      // If the countdown is over, display a message
      if (timeRemaining < 0) {
        clearInterval(countdownInterval);
        document.getElementById("timer").innerHTML = "Out Now!";
      }
    }, 1000);
