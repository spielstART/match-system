$(document).ready(function() {
  var buttons = $('input[type=button].btn-score');
  for(var i=0; i<buttons.length; i++) {
    $(buttons[i]).on('click', function(evt) {
      var _this = $(this);
      var buttonValue;
      if(_this.val() === '+') {
        buttonValue = 1;
      } else if(_this.val() === '-') {
        buttonValue = -1;
      }
      if(buttonValue) {
        $.post('/tournament/score', {
          id: _this.parents('tr').attr('data-player'),
          value: buttonValue
        }, function(data) {
          if(data) {
            _this.parents('tr').children('td.score').html(data);
          }
        });
      }
    });
  }
});
