$(document).ready(() => {

    let game = {};
  
    let values = {
      userHP: 0,
      defenderHP: 0,
      userAttackPoints: 0,
      defenderAttackPoints: 0,
      skill: 0,
      cnt: 0,
      isUsertCharacterChosen: false,
      isDefenderChosen: false,
      result: false,
      idSet: 'abcd',
      userId: '',
      defenderId: '',
      message: '',
      first: {
        health: 120,
        attack: 12
      },
      second: {
        health: 100,
        attack: 5
      },
      third: {
        health: 150,
        attack: 15
      },
      fourth: {
        health: 180,
        attack: 20
      }
    };
  
    let action = {
  
      setAttributes: function (target, targetNumber) {
        $(target).attr({
          'health': game[targetNumber].health,
          'attack': game[targetNumber].attack
        });
      },
  
      updateObj: function () {
        Object.assign(game, values);
      },
  
      updateMessage: function () {
        let userName = $(`#${game.userId}`).attr('value');
        let defenderName = $(`#${game.defenderId}`).attr('value');
        $('#fightInfo').html(`${userName} attacked ${defenderName} with ${game.skill} points.<br> He attacked ${userName} back with ${game.defenderAttackPoints} points.`);
      },
  
      updateHealthBar: function (id) {
        $(`#${id} .healthBar`).empty();
  
        for (let i = 0; i < parseInt($(`#${id}`).attr('health')) / 5; i++) {
          $(`#${id} .healthBar`).append('<div class="innerHealthbar"></div>');
        }
  
        $(`#${id} .healthBar`).css('display', 'flex');
  
        if (parseInt($(`#${id}`).attr('health')) < 75) {
          $(`#${id} .innerHealthbar`).css('background-color', '#ff1f1f');
        } else {
          $(`#${id} .innerHealthbar`).css('background-color', '#006400');
        }
  
      },
  
      setPlayers: function (event) {
  
        $('.firstMessage').hide();
  
        if (game.isUsertCharacterChosen === false) {
          $('#chosenCharacter').append($(event.currentTarget));
          game.userId = game.idSet.charAt(game.userId);
          $(event.currentTarget).attr('id', game.userId); //.off('click');
          action.setAttributes($(event.currentTarget), $(event.currentTarget).attr('number'));
          action.updateHealthBar(game.userId);
  
          game.userHP = parseInt($(event.currentTarget).attr('health'));
          game.userAttackPoints = parseInt($(event.currentTarget).attr('attack'));
          game.isUsertCharacterChosen = true;
          $('#fight button').css('display', 'block');
  
  
        } else if (game.isDefenderChosen === false) {
  
          $('#message').text('');
          game.cnt += 1;
          game.defenderId = game.idSet.charAt(game.cnt);
          action.setAttributes($(this), $(event.currentTarget).attr('number'));
          $('#defender').append($(event.currentTarget));
          $(event.currentTarget).attr('id', game.defenderId);
          action.updateHealthBar(game.defenderId);
          game.defenderHP = parseInt($(event.currentTarget).attr('health'));
          game.defenderAttackPoints = parseInt($(event.currentTarget).attr('attack'));
          game.isDefenderChosen = true;
  
        }
      },
  
      fight: function (event) {
        if (game.result === false) {
          if ($('#defender').children().length === 0) {
            $('#message').text('Defender is not chosen!');
          } else {
            game.skill += game.userAttackPoints;
            game.userHP -= game.defenderAttackPoints;
            game.defenderHP -= game.skill;
            $(`#${game.userId}`).attr('health', game.userHP);
            $(`#${game.defenderId}`).attr('health', game.defenderHP);
            $(`#${game.userId} .points`).html(game.userHP);
            $(`#${game.defenderId} .points`).html(game.defenderHP);
            action.updateMessage();
            action.updateHealthBar(game.userId);
            action.updateHealthBar(game.defenderId);
  
            if (parseInt($(`#${game.userId}`).attr('health')) <= 0) {
              if (parseInt($(`#${game.defenderId}`).attr('health')) <= 0 && parseInt($(`#${game.userId}`).attr('health')) <= 0 && game.cnt < 3) {
                $('#message').text('You killed eachother. But you lost! lol');
              } else if (parseInt($(`#${game.defenderId}`).attr('health')) <= 0 && parseInt($(`#${game.userId}`).attr('health')) <= 0) {
                $('#message').text('lol it\'s a draw!');
              } else {
                $('#message').text('You lost!');
              }
              game.result = true;
              $('#reset').css('display', 'block');
              $(`#${game.userId}`).hide().appendTo($('#availableCharacters'));
              $(`#${game.defenderId}`).hide().appendTo($('#availableCharacters'));
            } else if (parseInt($(`#${game.defenderId}`).attr('health')) <= 0 && game.cnt < 3) {
              game.isDefenderChosen = false;
              $(`#${game.defenderId}`).hide().appendTo($('#availableCharacters'));
              $('#message').text('You won! Pick another opponent!');
            } else if (parseInt($(`#${game.defenderId}`).attr('health')) <= 0 && game.cnt === 3) {
              $('#message').text('You won!');
              game.result = true;
              $(`#${game.defenderId}`).hide().appendTo($('#availableCharacters'));
              $('#reset').css('display', 'block');
            }
  
          }
        }
      },
  
      reset: function () {
  
        $('#message, #fightInfo').text('');
        $('#reset, #fight button').hide();
        $('#a').prependTo('#availableCharacters');
        $('#defender div').appendTo($('#availableCharacters'));
        $('.player').show();
  
        for (let i = 0; i <= game.cnt; i++) {
          $(`#${game.idSet[i]}`).attr('health', game[$(`#${game.idSet[i]}`).attr('number')].health);
          $(`#${game.idSet[i]} .points`).html($(`#${game.idSet[i]}`).attr('health'));
          $(`#${game.idSet[i]}`).removeAttr('id');
        }
  
        $('.firstMessage').show();
        $('.healthBar').hide();
        action.updateObj();
      }
  
    };
  
    //program exuction
    action.updateObj();
    $('.player').on('click', action.setPlayers);
    $('#attack').on('click', action.fight);
    $('#reset').on('click', action.reset);
  });