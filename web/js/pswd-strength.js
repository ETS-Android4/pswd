(function($){
     $.fn.extend({
         pwdstr: function(el) {
			return this.each(function() {



					$(this).keyup(function(){
						$(el).html(getTime($(this).val()));
					});

					function getTime(str){

					var chars = 0;
					var rate = 2800000000;

					if((/[a-z]/).test(str)) chars +=  26;
					if((/[A-Z]/).test(str)) chars +=  26;
					if((/[0-9]/).test(str)) chars +=  10;
					if((/[^a-zA-Z0-9]/).test(str)) chars +=  32;

					var pos = Math.pow(chars,str.length);
					var s = pos/rate;

					var decimalYears = s/(3600*24*365);
					var years = Math.floor(decimalYears);

					var decimalMonths =(decimalYears-years)*12;
					var months = Math.floor(decimalMonths);

					var decimalDays = (decimalMonths-months)*30;
					var days = Math.floor(decimalDays);

					var decimalHours = (decimalDays-days)*24;
					var hours = Math.floor(decimalHours);

					var decimalMinutes = (decimalHours-hours)*60;
					var minutes = Math.floor(decimalMinutes);

					var decimalSeconds = (decimalMinutes-minutes)*60;
					var seconds = Math.floor(decimalSeconds);

					var time = [];

					if(years > 0){
						if(years == 1)
							time.push("1 year, ");
						else
							time.push(years + " years, ");
					}
					if(months > 0){
						if(months == 1)
							time.push("1 month, ");
						else
							time.push(months + " months, ");
					}
					if(days > 0){
						if(days == 1)
							time.push("1 day, ");
				 		else
							time.push(days + " days, ");
					}
					if(hours > 0){
						if(hours == 1)
							time.push("1 hour, ");
						else
							time.push(hours + " hours, ");
					}
					if(minutes > 0){
						if(minutes == 1)
							time.push("1 minute, ");
						else
							time.push(minutes + " minutes, ");
					}
					if(seconds > 0){
						if(seconds == 1)
							time.push("1 second, ");
						else
							time.push(seconds + " seconds, ");
					}

					if(time.length <= 0)
						time = "less than one second, ";
					else if(time.length == 1)
						time = time[0];
					else
						time = time[0] + time[1];

					 return time.substring(0,time.length-2);
					}

			 });
        }
    });
})(jQuery);






/*jslint vars: false, browser: true, nomen: true, regexp: true */
/*global jQuery */

/*
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*
*/

(function ($) {
    "use strict";

    var options = {
            errors: [],
            // Options
            minChar: 8,
            errorMessages: {
                password_to_short: "The Password is too short",
                same_as_username: "Your password cannot be the same as the domain!"
            },
            scores: [17, 26, 40, 50],
            verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
            showVerdicts: true,
            raisePower: 1.4,
            usernameField: "#domain",
            onLoad: undefined,
            onKeyUp: undefined,
            viewports: {
                progress: undefined,
                verdict: undefined,
                errors: undefined
            },
            // Rules stuff
            ruleScores: {
                wordNotEmail: -100,
                wordLength: -100,
                wordSimilarToUsername: -100,
                wordLowercase: 1,
                wordUppercase: 3,
                wordOneNumber: 3,
                wordThreeNumbers: 5,
                wordOneSpecialChar: 3,
                wordTwoSpecialChar: 5,
                wordUpperLowerCombo: 2,
                wordLetterNumberCombo: 2,
                wordLetterNumberCharCombo: 2
            },
            rules: {
                wordNotEmail: true,
                wordLength: true,
                wordSimilarToUsername: true,
                wordLowercase: true,
                wordUppercase: true,
                wordOneNumber: true,
                wordThreeNumbers: true,
                wordOneSpecialChar: true,
                wordTwoSpecialChar: true,
                wordUpperLowerCombo: true,
                wordLetterNumberCombo: true,
                wordLetterNumberCharCombo: true
            },
            validationRules: {
                wordNotEmail: function (options, word, score) {
                    return word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) && score;
                },
                wordLength: function (options, word, score) {
                    var wordlen = word.length,
                        lenScore = Math.pow(wordlen, options.raisePower);
                    if (wordlen < options.minChar) {
                        lenScore = (lenScore + score);
                        options.errors.push(options.errorMessages.password_to_short);
                    }
                    return lenScore;
                },
                wordSimilarToUsername: function (options, word, score) {
                    var username = $(options.usernameField).val();
                    if (username && word.toLowerCase().match(username.toLowerCase())) {
                        options.errors.push(options.errorMessages.same_as_username);
                        return score;
                    }
                    return true;
                },
                wordLowercase: function (options, word, score) {
                    return word.match(/[a-z]/) && score;
                },
                wordUppercase: function (options, word, score) {
                    return word.match(/[A-Z]/) && score;
                },
                wordOneNumber : function (options, word, score) {
                    return word.match(/\d+/) && score;
                },
                wordThreeNumbers : function (options, word, score) {
                    return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
                },
                wordOneSpecialChar : function (options, word, score) {
                    return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
                },
                wordTwoSpecialChar : function (options, word, score) {
                    return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
                },
                wordUpperLowerCombo : function (options, word, score) {
                    return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
                },
                wordLetterNumberCombo : function (options, word, score) {
                    return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
                },
                wordLetterNumberCharCombo : function (options, word, score) {
                    return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
                }
            }
        },

        setProgressBar = function ($el, score) {
            var options = $el.data("pwstrength"),
                progressbar = options.progressbar,
                $verdict;

            if (options.showVerdicts) {
                if (options.viewports.verdict) {
                    $verdict = $(options.viewports.verdict).find(".password-verdict");
                } else {
                    $verdict = $el.parent().find(".password-verdict");
                    if ($verdict.length === 0) {
                        $verdict = $('<span class="password-verdict"></span>');
                        $verdict.insertAfter($el);
                    }
                }
            }

            if (score < options.scores[0]) {
                progressbar.find(".bar").addClass("progress-bar-danger").removeClass("progress-bar-warning").removeClass("progress-bar-success");
                progressbar.find(".bar").addClass("progress-bar");
                progressbar.find(".bar").css("width", "5%");
                if (options.showVerdicts) {
                    $verdict.text(options.verdicts[0]);
                }
            } else if (score >= options.scores[0] && score < options.scores[1]) {
                progressbar.find(".bar").addClass("progress-bar-danger").removeClass("progress-bar-warning").removeClass("progress-bar-success");
                progressbar.find(".bar").addClass("progress-bar");
                progressbar.find(".bar").css("width", "25%");
                if (options.showVerdicts) {
                    $verdict.text(options.verdicts[1]);
                }
            } else if (score >= options.scores[1] && score < options.scores[2]) {
                progressbar.find(".bar").addClass("progress-bar-warning").removeClass("progress-bar-danger").removeClass("progress-bar-success");
                progressbar.find(".bar").addClass("progress-bar");
                progressbar.find(".bar").css("width", "50%");
                if (options.showVerdicts) {
                    $verdict.text(options.verdicts[2]);
                }
            } else if (score >= options.scores[2] && score < options.scores[3]) {
                progressbar.find(".bar").addClass("progress-bar-warning").removeClass("progress-bar-danger").removeClass("progress-bar-success");
                progressbar.find(".bar").addClass("progress-bar");
                progressbar.find(".bar").css("width", "75%");
                if (options.showVerdicts) {
                    $verdict.text(options.verdicts[3]);
                }
            } else if (score >= options.scores[3]) {
                progressbar.find(".bar").addClass("progress-bar-success").removeClass("progress-bar-warning").removeClass("progress-bar-danger");
                progressbar.find(".bar").addClass("progress-bar");
                progressbar.find(".bar").css("width", "100%");
                if (options.showVerdicts) {
                    $verdict.text(options.verdicts[4]);
                }
            }
        },

        calculateScore = function ($el) {
            var self = this,
                word = $el.val(),
                totalScore = 0,
                options = $el.data("pwstrength");

            $.each(options.rules, function (rule, active) {
                if (active === true) {
                    var score = options.ruleScores[rule],
                        result = options.validationRules[rule](options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                }
            });
            setProgressBar($el, totalScore);
            return totalScore;
        },

        progressWidget = function () {
            return '<div class="progress"><div class="bar"></div></div>';
        },

        methods = {
            init: function (settings) {
                var self = this,
                    allOptions = $.extend(options, settings);

                return this.each(function (idx, el) {
                    var $el = $(el),
                        progressbar,
                        verdict;

                    $el.data("pwstrength", allOptions);

                    $el.on("keyup", function (event) {
                        var options = $el.data("pwstrength");
                        options.errors = [];
                        calculateScore.call(self, $el);
                        if ($.isFunction(options.onKeyUp)) {
                            options.onKeyUp(event);
                        }
                    });

                    progressbar = $(progressWidget());
                    if (allOptions.viewports.progress) {
                        $(allOptions.viewports.progress).append(progressbar);
                    } else {
                        progressbar.insertAfter($el);
                    }
                    progressbar.find(".bar").css("width", "0%");
                    $el.data("pwstrength").progressbar = progressbar;

                    if (allOptions.showVerdicts) {
                        verdict = $('<span class="password-verdict">' + allOptions.verdicts[0] + '</span>');
                        if (allOptions.viewports.verdict) {
                            $(allOptions.viewports.verdict).append(verdict);
                        } else {
                            verdict.insertAfter($el);
                        }
                    }

                    if ($.isFunction(allOptions.onLoad)) {
                        allOptions.onLoad();
                    }
                });
            },

            destroy: function () {
                this.each(function (idx, el) {
                    var $el = $(el);
                    $el.parent().find("span.password-verdict").remove();
                    $el.parent().find("div.progress").remove();
                    $el.parent().find("ul.error-list").remove();
                    $el.removeData("pwstrength");
                });
            },

            forceUpdate: function () {
                var self = this;
                this.each(function (idx, el) {
                    var $el = $(el),
                        options = $el.data("pwstrength");
                    options.errors = [];
                    calculateScore.call(self, $el);
                });
            },

            outputErrorList: function () {
                this.each(function (idx, el) {
                    var output = '<ul class="error-list">',
                        $el = $(el),
                        errors = $el.data("pwstrength").errors,
                        viewports = $el.data("pwstrength").viewports,
                        verdict;
                    $el.parent().find("ul.error-list").remove();

                    if (errors.length > 0) {
                        $.each(errors, function (i, item) {
                            output += '<li>' + item + '</li>';
                        });
                        output += '</ul>';
                        if (viewports.errors) {
                            $(viewports.errors).html(output);
                        } else {
                            output = $(output);
                            verdict = $el.parent().find("span.password-verdict");
                            if (verdict.length > 0) {
                                el = verdict;
                            }
                            output.insertAfter(el);
                        }
                    }
                });
            },

            addRule: function (name, method, score, active) {
                this.each(function (idx, el) {
                    var options = $(el).data("pwstrength");
                    options.rules[name] = active;
                    options.ruleScores[name] = score;
                    options.validationRules[name] = method;
                });
            },

            changeScore: function (rule, score) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").ruleScores[rule] = score;
                });
            },

            ruleActive: function (rule, active) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").rules[rule] = active;
                });
            }
        };

    $.fn.pwstrength = function (method) {
        var result;
        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength");
        }
        return result;
    };
}(jQuery));
