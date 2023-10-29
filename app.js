addEventListener('DOMContentLoaded',()=>{

    const bird = document.querySelector('.bird');
    const gameDisplay = document.querySelector('.game-container');
    const ground = document.querySelector('.ground');
    const counterBoard = document.querySelector('.counter');
    let isGameOver = false;
    let isStarted = false;

    const WINDOW_HEIGHT = 620;
    const WINDOW_WIDTH = 500;
    const OBSTACLE_WIDTH = 60;
    const GAP = 140;
    const GROUND_HEIGHT = 160;
    const BIRD_SIZE = 40;

    const startPosBirdLeft = 220;
    const startPosBirdBottom = 150;


        let birdLeft = startPosBirdLeft;
        let birdBottom = startPosBirdBottom;
        const gravity = 2;

        let counter = 0;

    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
    function birdFalling(){
        isStarted = true;

        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';

        if(birdBottom >0)
        birdBottom -= gravity;
        else gameOver();

    }

    let gameTimerId ;


    function jump(){
        if(birdBottom<530) birdBottom += 35;
        bird.style.bottom = birdBottom + 'px';
    }

    //may be change on only space
    addEventListener('keyup',()=>{
        if(!isStarted)
        restart();
        jump()
    });
    addEventListener('mouseup',()=>{
        if(!isStarted)
        restart();
        jump()
    });


    function generateObstacle(){
        let isCounted = false;
        const obstacleBottom = document.createElement('div');
        obstacleBottom.classList.add('obstacle');
        gameDisplay.appendChild(obstacleBottom);

        //add class for styling
        const obstacleTop = document.createElement('div');
        obstacleTop.classList.add('obstacle');
        gameDisplay.appendChild(obstacleTop);

        let obstacleBottomHeight =100 + Math.floor(Math.random()*(WINDOW_HEIGHT-GAP-200));
        let obstacleTopHeight = WINDOW_HEIGHT - obstacleBottomHeight - GAP;
        let obstacleLeft = WINDOW_WIDTH;

        obstacleBottom.style.height = obstacleBottomHeight + 'px';
        obstacleBottom.style.bottom = GROUND_HEIGHT + 'px';
        obstacleBottom.style.left =  obstacleLeft + 'px';

        obstacleTop.style.height = obstacleTopHeight + 'px';
        obstacleTop.style.left =  obstacleLeft + 'px';

        const obstacleSpeed = 1;

        function moveObstacles(){
        obstacleLeft -= obstacleSpeed;
        obstacleTop.style.left =obstacleLeft +'px';
        obstacleBottom.style.left =obstacleLeft +'px';
            if(obstacleLeft<0-OBSTACLE_WIDTH) {
                clearInterval(moveObstacleInterval)
                gameDisplay.removeChild(obstacleBottom);
                gameDisplay.removeChild(obstacleTop);
            }
            if( obstacleLeft <= (birdLeft+BIRD_SIZE+1) && obstacleLeft >= (birdLeft-OBSTACLE_WIDTH+1)&& birdBottom <= obstacleBottomHeight){
                gameOver()
            }
            if(obstacleLeft <= (birdLeft+BIRD_SIZE+1) && obstacleLeft >= (birdLeft-OBSTACLE_WIDTH+1)&& birdBottom+BIRD_SIZE >= obstacleBottomHeight+GAP){
                gameOver()
            }
            if(isGameOver){
                clearInterval(moveObstacleInterval)
            }
            //
            if(birdLeft>obstacleLeft+OBSTACLE_WIDTH && !isCounted){

                counter++
                counterBoard.innerHTML=`${counter}`;
                isCounted = true;
            }

        }
        const moveObstacleInterval = setInterval(moveObstacles,10);

    }

    let generationObstaclesInterval ;

    function fallAfterDie(){
        let isFall = false;
        const fallAfterDieInterval = setInterval(()=>{
            if(birdBottom> 0) {

                if((birdBottom-gravity*5)<0) bird.style.bottom = 0 + 'px';
                else {
                    birdBottom -= gravity*5;
                    bird.style.bottom = birdBottom + 'px';
                }
            }
            else clearInterval(fallAfterDieInterval)

            },20);
    }

    function gameOver(){
        isGameOver = true;
        isStarted = false;
        clearInterval(generationObstaclesInterval);
        clearInterval(gameTimerId);
        removeEventListener('keyup',jump);
        removeEventListener('mouseup',jump);

        let record = localStorage.getItem('record');
        if(Number(record)<counter) localStorage.setItem('record', `${counter}`);
        fallAfterDie()
        counter=0;
    }

    //restarting game

    function removeObstacles(){
        const obstacles = document.querySelectorAll('.obstacle');
        for (let i = 0; i<obstacles.length; i++){
            obstacles[i].parentNode.removeChild(obstacles[i])
        }
    }

    function restart(){
        isGameOver = false;
        removeObstacles();
        counterBoard.innerHTML=`${counter}`;
        birdLeft = startPosBirdLeft;
        birdBottom = startPosBirdBottom;
        addEventListener('keyup',jump);
        addEventListener('mouseup',jump);
        gameTimerId = setInterval(birdFalling,20);
        generationObstaclesInterval = setInterval(generateObstacle,3000)

    }



    const btn = document.querySelector('#btn');
    btn.addEventListener('click',restart)


})
