
$(document).ready(function() {
    console.log("jQuery is ready!");

    // Task 1: Live Search
    $("#menuSearch").on("input", function() {
        let search = $(this).val().toLowerCase();

        $(".menu-category").each(function() {
            let category = $(this);
            let found = 0;

            category.find(".bloom-bootstrap-card").each(function() {
                let card = $(this);
                let name = card.find(".card-title").text().toLowerCase();

                if (name.includes(search)) {
                    card.parent().show();
                    found++;
                } else {
                    card.parent().hide();
                }
            });

            if (found > 0) {
                category.show();
            } else {
                category.hide();
            }
        });
    });

    // Task 2: Autocomplete Suggestions
    $("#menuSearch").on("input", function() {
        let search = $(this).val().toLowerCase();
        let suggestions = $("#searchSuggestions");

        suggestions.empty();

        if (search === "") {
            return;
        }

        $(".card-title").each(function() {
            let name = $(this).text().trim();

            if (name.toLowerCase().includes(search)) {
                let item = $("<div></div>");
                item.addClass("suggestion-item");
                item.text(name);

                item.on("click", function() {
                    $("#menuSearch").val(name).trigger("input");
                    suggestions.empty();
                });

                suggestions.append(item);
            }
        });
    });

    // Task 3: Search Highlighting
    $(".card-title").each(function() {
        $(this).data("original", $(this).text());
    });

    $("#menuSearch").on("input", function() {
        let search = $(this).val().trim().toLowerCase();

        $(".card-title").each(function() {
            let title = $(this);
            let original = title.data("original");

            title.empty();

            if (search === "") {
                title.text(original);
                return;
            }

            let position = original.toLowerCase().indexOf(search);

            if (position === -1) {
                title.text(original);
            } else {
                title.text(original.substring(0, position));

                let highlight = $("<mark></mark>");
                highlight.text(original.substring(position, position + search.length));
                title.append(highlight);

                title.append(original.substring(position + search.length));
            }
        });
    });

    // Task 4: Scroll Progress Bar
    $(window).on("scroll", function() {
        let scrollTop = $(window).scrollTop();
        let pageHeight = $(document).height() - $(window).height();

        let progress = 0;

        if (pageHeight > 0) {
            progress = (scrollTop / pageHeight) * 100;
        }

        $("#scrollProgress").css("width", progress + "%");
    });

    // Task 5: Animated Number Counter
    let counterStarted = false;

    function startCounters() {
        if ($(".counter").length === 0 || counterStarted) {
            return;
        }

        let counterTop = $(".counter").first().offset().top;
        let screenBottom = $(window).scrollTop() + $(window).height();

        if (screenBottom >= counterTop) {
            counterStarted = true;

            $(".counter").each(function() {
                let counter = $(this);
                let target = Number(counter.attr("data-target"));

                $({ number: 0 }).animate(
                    { number: target },
                    {
                        duration: 2000,
                        easing: "swing",
                        step: function() {
                            counter.text(Math.floor(this.number));
                        },
                        complete: function() {
                            counter.text(target);
                        }
                    }
                );
            });
        }
    }

    $(window).on("scroll", startCounters);
    startCounters();

    // Task 6: Loading Spinner
    $("#reserveSubmit").on("click", function() {
        let button = $(this);
        let form = button.closest("form");

        // Check if the form is valid
        if (!form[0].checkValidity()) {
            return;
        }

        // Disable button and show spinner
        button.prop("disabled", true);
        button.html(
            '<span class="loading-spinner"></span> Please wait...'
        );

        // Return button to normal after 2 seconds
        setTimeout(function() {
            button.prop("disabled", false);
            button.text("Reserve a Table");
            
            $("#reservationToast").stop(true, true).fadeIn(300);

            setTimeout(function() {
                $("#reservationToast").fadeOut(500);
            }, 3000);

        }, 2000);
    });

    // Task 8: Copy to Clipboard
    $("#copyButton").on("click", function() {
        let text = $("#copyText").text();
        let button = $(this);

        navigator.clipboard.writeText(text).then(function() {
            button.text("✓ Copied!");
            $("#copyMessage").text("Copied to clipboard!");

            setTimeout(function() {
                button.text("Copy");
                $("#copyMessage").text("");
            }, 2000);
        }).catch(function() {
            $("#copyMessage").text("Could not copy text.");
        });
    });

    // Task 9: Image Lazy Loading
    $("img[loading='lazy']").each(function() {
        let image = $(this);

        image.on("load", function() {
            image.addClass("image-loaded");
        });

        if (this.complete && this.naturalWidth > 0) {
            image.addClass("image-loaded");
        }
    });


});
