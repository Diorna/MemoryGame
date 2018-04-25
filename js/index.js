$(document).ready(function() {
            var score = 0;
            $('#Game').hide();
            $('#EndGame').hide();
            var arr_open_img = Array(2);
            var arr_open_div = Array(2);
            var count = 18;
            var data_tid = 'Card';
            var count_open;
            var all_pars_open = 0;
            
  //-----------Рандом для выборки карт из папки
            function f_getRandom(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            } 
                
//-----------Перетасовка готового массива карт
            function f_compareRandom(arr) {
                var i = arr.length;
                var j, temp;
                while(--i > 0){
                    j = Math.floor(Math.random() * (i+1));
                    temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                }
            }
//--------Переворот карт рубашками наверх            
                function f_hide(time){
                    setTimeout(function() { 
                        $(".card img").hide();
                        $(".card").attr("data-tid", "Card-flipped");
                        $(".card").removeClass("open_card");
                    }, time);
                } 
            
       
//-------Создание массива карт для текущей игры----------
            function f_add_game_images(count){
                var card_lear = ['C', 'D', 'H', 'S'];
                var card_value = ['0','2','3','4','5','6','7','8','9','A','J','K','Q'];
                var arrImages  = new Array();
                var structure = '';
                var el_exist;
                var i = 0;
                
                while(arrImages.length<(count/2) && i<500){//(i<500) - Условие для избежания зацикливания
                    var index_card_lear = f_getRandom(0, card_lear.length-1);
                    var index_card_value = f_getRandom(0, card_value.length-1);
                    
                    var name_card = card_value[index_card_value] + card_lear[index_card_lear] + ".png";
                    
                    el_exist = false;
                    for(j=0;j<arrImages.length;j++){
                        if(name_card==arrImages[j]){
                            el_exist = true;
                            break;
                        }
                    }
                    if(el_exist == true) continue;
                    arrImages.push(name_card);
                    i++;
                }
                
                for(i=0;i<count/2;i++){
                    arrImages.push(arrImages[i]);
                }
                f_compareRandom(arrImages);
                for(j=0;j<count;j++){
                    structure +='<div class="card" data-tid="'+data_tid+'" id="one_card'+j+'"><img src="img/Cards/'+arrImages[j]+'"></div>';
                 }
                return structure;
            }

//----------Вывод заработанных очков         
                function f_write_scores(score){
                    $('.scores').html(score);
                }
            
//-------------Начало игры, расклад карт
                function f_start_game(){
                    $('#Start').hide();
                    $('#Game').show();
                    score = 0;
                    f_write_scores(score);
                    $('#deck').html(f_add_game_images(count));
                }
            
  //-----------Главный экран начала игры              
                $('#NewGame').mouseup(function(){
                    f_start_game();
                    f_hide(5000);
                });             
                

//------------Переворот карточек  по клику 
            $('#deck').on('mouseup', function(click_e){
                    var id = click_e.target.id;
                    $('#'+id+' img').show(); 
                    $('#'+id).attr('data-tid', 'Card');
                    $('#'+id).addClass('open_card');
                    count_open = $('.open_card').length;
                    arr_open_img [count_open-1] = $('#'+id+' img').attr('src');
                    arr_open_div [count_open-1] = id; 
                
                    if(count_open==2){   
                        if((arr_open_img[0]===arr_open_img[1])&&(arr_open_div[0]!=arr_open_div[1])){
                            setTimeout(function() { 
                                $('#'+arr_open_div[0]).css('opacity', '0');
                                $('#'+arr_open_div[1]).css('opacity', '0');
                                $('.card').removeClass('open_card');
                             }, 600);
                            all_pars_open ++;
                            score += (count/2-all_pars_open)*42;
                        }else{
                            f_hide(600);
                            score -= all_pars_open*42;
                        }
                        if(score<=0){score = 0;}
                        f_write_scores(score);
                    }
                
                    if(all_pars_open==9){
                        setTimeout(function(){
                            $('#Game').hide();
                            $('#EndGame').show();
                            f_write_scores(score);
                        }, 600);
                    }
            });
            
 //------------Начать заново               
                $('#restart').click(function(){
                    f_start_game();
                    f_hide(5000);
                });
//------------Еще раз   
                $('#more_restart').click(function(){
                    $('#EndGame').hide();
                    all_pars_open = 0;
                    f_start_game();
                    f_hide(5000);
                });
});
//-----------окончание ready