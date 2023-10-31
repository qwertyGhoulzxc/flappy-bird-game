addEventListener('DOMContentLoaded',()=>{

    const bird = document.querySelector('.bird');
    const gameDisplay = document.querySelector('.game-container');
    const ground = document.querySelector('.ground');
    const counterBoard = document.querySelector('.counter');
    const restartBtn = document.querySelector('.restart-btn');
    const controlsBox = document.querySelector('.controls');
    const scoreNumber = document.querySelector('.scoreNumber');
    const bestNumber = document.querySelector('.bestNumber');

    let isGameOver = false;
    let isStarted = false;
    let isFirstGame = true;

    const WINDOW_HEIGHT = 620;
    const WINDOW_WIDTH = 500;
    const OBSTACLE_WIDTH = 60;
    const GAP = 160;
    const GROUND_HEIGHT = 160;
    const BIRD_SIZE = 40;

    const startPosBirdLeft = 220;
    const startPosBirdBottom = 150;


        let birdLeft = startPosBirdLeft;
        let birdBottom = startPosBirdBottom;

        const idlenessGravity = 6;
        const jumpingGravity = 3;
        const heightOfJump = 45;

        let gravity = jumpingGravity;

        let counter = 0;
    controlsBox.style.display = 'none';
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
    function birdFalling(){
        isStarted = true;

        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';

        if(birdBottom >0){
        birdBottom -= gravity;
        if((birdBottom-gravity)<0){ bird.style.bottom = 0 + 'px';
        gameOver()
        }
        }
        else gameOver();

    }

    let gameTimerId ;
    let changeGravity;
    function jump(){
        if(birdBottom<530) birdBottom += heightOfJump;
        bird.style.bottom = birdBottom + 'px';
        gravity=jumpingGravity;
        clearTimeout(changeGravity);
        changeGravity =setTimeout(()=>{gravity=idlenessGravity; isGravityChanged=false},0)

    }

    //may be change on only space
    addEventListener('keyup',()=>{
        if(!isStarted&& isFirstGame ) {
            restart();

        }
        if (!isGameOver)
        jump()
    });
    addEventListener('mouseup',()=>{
        if(!isStarted&& isFirstGame ) {
            restart();

        }
        if (!isGameOver)
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

        const obstacleSpeed = 2;

        function moveObstacles(){
        obstacleLeft -= obstacleSpeed;
        obstacleTop.style.left =obstacleLeft +'px';
        obstacleBottom.style.left =obstacleLeft +'px';
            if(obstacleLeft<0-OBSTACLE_WIDTH) {
                clearInterval(moveObstacleInterval)
                gameDisplay.removeChild(obstacleBottom);
                gameDisplay.removeChild(obstacleTop);
            }
            if( obstacleLeft <= (birdLeft+BIRD_SIZE-1) && obstacleLeft >= (birdLeft-OBSTACLE_WIDTH-1)&& birdBottom <= obstacleBottomHeight){
                gameOver()
            }
            if(obstacleLeft <= (birdLeft+BIRD_SIZE-1) && obstacleLeft >= (birdLeft-OBSTACLE_WIDTH-1)&& birdBottom+BIRD_SIZE >= obstacleBottomHeight+GAP){
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
    let fallAfterDieInterval;
    function fallAfterDie(){
        let isFall = false;
        fallAfterDieInterval = setInterval(()=>{
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
        isFirstGame = false;
        gravity = jumpingGravity;
        clearInterval(generationObstaclesInterval);
        clearInterval(gameTimerId);
        removeEventListener('keyup',jump);
        removeEventListener('mouseup',jump);
        clearTimeout(changeGravity);
        let record = localStorage.getItem('record');
        if(Number(record)<counter) localStorage.setItem('record', `${counter}`);
        fallAfterDie()
        Controls();
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
        clearInterval(fallAfterDieInterval);
        isGameOver = false;
        removeObstacles();
        counterBoard.innerHTML=`${counter}`;
        birdLeft = startPosBirdLeft;
        birdBottom = startPosBirdBottom;
        addEventListener('keyup',jump);
        addEventListener('mouseup',jump);
        gameTimerId = setInterval(birdFalling,30);
        generationObstaclesInterval = setInterval(generateObstacle,1500);

        Controls();


    }


    restartBtn.addEventListener('click',restart)

    function Controls(){
        if(!isGameOver){
            controlsBox.style.display = 'none';
            counterBoard.style.display = 'block';
        }else {
            controlsBox.style.display = 'flex';
            restartBtn.style.display = 'block';
            scoreNumber.innerHTML = `${counter}`;
            bestNumber.innerHTML = `${localStorage.getItem('record')}`
            counterBoard.style.display = 'none';

        }
    }

})
//убрать после рестарта свободный полет, сделать механику как в начале игры при обновлении страницы
