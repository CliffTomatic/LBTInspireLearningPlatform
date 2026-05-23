import { useEffect, useRef } from 'react';

import GameCard, {
    type GameCardProps,
} from '../../components/GameCard/GameCard';
import HowToPlayCard, {
    type HowToPlayCardProps,
} from '../../components/HowToPlayCard/HowToPlayCard';
import './GamesPage.css';

const featuredGames: GameCardProps[] = [
    {
        title: 'Computer Workshop: PC Assembly',
        description:
            'Our PC Assembly game helps you learn about computer parts and how they fit together. Just drag and drop each part into place and watch your PC come to life!',
        imageUrl: '/assets/thumbnails/placeholder.png',
        imageAlt: 'PC Assembly game preview',
    },
    {
        title: 'Cyber Defense Game',
        description:
            'Use your cyber security skills and tools to defend your computer against malicious attacks! Simply click and drop, and see how powerful your army is!',
        imageUrl: '/assets/thumbnails/placeholder.png',
        imageAlt: 'Cyber Defense game preview',
    },
    {
        title: 'Internet Gauntlet',
        description:
            'Step into the Internet Gauntlet! Explore a wild map full of mini-games, controlling your character as you move around and take on fun challenges.',
        imageUrl: '/assets/thumbnails/placeholder.png',
        imageAlt: 'Internet Gauntlet game preview',
    },
];

const howToPlayGames: HowToPlayCardProps[] = [
    {
        title: 'Computer Workshop: PC Assembly',
        videoSrc: '/assets/videos/Video_1.mp4',
    },
    {
        title: 'Cyber Defense Game',
        videoSrc: '/assets/videos/Video_1.mp4',
    },
    {
        title: 'Internet Gauntlet',
        videoSrc: '/assets/videos/Video_1.mp4',
    },
];

function GamesPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const exploreSectionRef = useRef<HTMLElement | null>(null);
    const howToPlaySectionRef = useRef<HTMLElement | null>(null);

    const scrollToSection = (section: HTMLElement | null) => {
        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return undefined;
        }

        const paddleWidth = 12;
        const ballRadius = 10;
        const paddleColor = '#f4f7f8';
        const ballColor = '#ffffff';

        let animationFrameId = 0;
        let paddleHeight = 100;
        let leftPaddle = { x: 0, y: 0 };
        let rightPaddle = { x: 0, y: 0 };
        let ball = { x: 0, y: 0, dx: 5, dy: 4 };
        let canvasWidth = 0;
        let canvasHeight = 0;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        const drawPaddle = (paddle: { x: number; y: number }) => {
            context.fillStyle = paddleColor;
            context.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
        };

        const drawBall = () => {
            context.beginPath();
            context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            context.fillStyle = ballColor;
            context.fill();
            context.closePath();
        };

        const movePaddleAI = (
            paddle: { x: number; y: number },
            targetY: number,
        ) => {
            const centerPaddle = paddle.y + paddleHeight / 2;

            if (centerPaddle < targetY - 6) {
                paddle.y += 5;
            } else if (centerPaddle > targetY + 6) {
                paddle.y -= 5;
            }

            paddle.y = Math.max(
                0,
                Math.min(canvasHeight - paddleHeight, paddle.y),
            );
        };

        const resetBall = (direction: 1 | -1) => {
            ball = {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                dx: 5 * direction,
                dy: (Math.random() > 0.5 ? 1 : -1) * 4,
            };
        };

        const resizeCanvas = () => {
            const heroElement = canvas.parentElement;
            const fallbackHeight = window.innerHeight * 0.625;
            const width = heroElement?.clientWidth ?? window.innerWidth;
            const height = heroElement?.clientHeight ?? fallbackHeight;
            const devicePixelRatio = window.devicePixelRatio || 1;

            canvasWidth = Math.floor(width);
            canvasHeight = Math.floor(height);

            canvas.width = Math.floor(canvasWidth * devicePixelRatio);
            canvas.height = Math.floor(canvasHeight * devicePixelRatio);
            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            context.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0,
            );

            paddleHeight = Math.min(
                Math.max(72, canvasHeight * 0.2),
                Math.max(24, canvasHeight - 8),
            );

            leftPaddle = {
                x: 0,
                y: canvasHeight / 2 - paddleHeight / 2,
            };
            rightPaddle = {
                x: canvasWidth - paddleWidth,
                y: canvasHeight / 2 - paddleHeight / 2,
            };

            resetBall(Math.random() > 0.5 ? 1 : -1);
        };

        const update = () => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (
                ball.y - ballRadius <= 0 ||
                ball.y + ballRadius >= canvasHeight
            ) {
                ball.dy *= -1;
                ball.y = Math.max(
                    ballRadius,
                    Math.min(canvasHeight - ballRadius, ball.y),
                );
            }

            if (ball.dx < 0) {
                movePaddleAI(leftPaddle, ball.y);
            } else {
                movePaddleAI(rightPaddle, ball.y);
            }

            leftPaddle.y = Math.max(
                0,
                Math.min(canvasHeight - paddleHeight, leftPaddle.y),
            );
            rightPaddle.y = Math.max(
                0,
                Math.min(canvasHeight - paddleHeight, rightPaddle.y),
            );

            ball.y = Math.max(
                ballRadius,
                Math.min(canvasHeight - ballRadius, ball.y),
            );

            const ballMovingLeft = ball.dx < 0;

            if (
                ballMovingLeft &&
                ball.x - ballRadius <= leftPaddle.x + paddleWidth &&
                ball.x - ballRadius >= leftPaddle.x &&
                ball.y >= leftPaddle.y &&
                ball.y <= leftPaddle.y + paddleHeight
            ) {
                ball.dx = Math.abs(ball.dx);
                ball.x = leftPaddle.x + paddleWidth + ballRadius;
            }

            if (
                !ballMovingLeft &&
                ball.x + ballRadius >= rightPaddle.x &&
                ball.x + ballRadius <= rightPaddle.x + paddleWidth &&
                ball.y >= rightPaddle.y &&
                ball.y <= rightPaddle.y + paddleHeight
            ) {
                ball.dx = -Math.abs(ball.dx);
                ball.x = rightPaddle.x - ballRadius;
            }

            if (ball.x < -ballRadius * 2) {
                resetBall(1);
            }

            if (ball.x > canvasWidth + ballRadius * 2) {
                resetBall(-1);
            }
        };

        const render = () => {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            const backgroundGradient = context.createLinearGradient(
                0,
                0,
                canvasWidth,
                canvasHeight,
            );
            backgroundGradient.addColorStop(0, '#0b1520');
            backgroundGradient.addColorStop(0.5, '#081219');
            backgroundGradient.addColorStop(1, '#102434');
            context.fillStyle = backgroundGradient;
            context.fillRect(0, 0, canvasWidth, canvasHeight);

            drawPaddle(leftPaddle);
            drawPaddle(rightPaddle);
            drawBall();
        };

        const gameLoop = () => {
            if (!prefersReducedMotion.matches) {
                update();
            }

            render();
            animationFrameId = window.requestAnimationFrame(gameLoop);
        };

        const handleResize = () => {
            resizeCanvas();
        };

        resizeCanvas();
        gameLoop();
        window.addEventListener('resize', handleResize);
        prefersReducedMotion.addEventListener('change', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            prefersReducedMotion.removeEventListener('change', handleResize);
        };
    }, []);

    return (
        <main className="games-page">
            <section className="games-page__hero">
                <canvas
                    ref={canvasRef}
                    className="games-page__canvas"
                    aria-hidden="true"
                />

                <div className="page-container games-page__hero-content">
                    <div className="games-page__copy">
                        <h1 className="games-page__title">
                            LearnBasic
                            <span className="games-page__title-accent">
                                Games
                            </span>
                        </h1>
                        <p className="games-page__description">
                            Learn the world of digital technology within your
                            own digital world!
                        </p>
                        <div className="games-page__hero-actions">
                            <button
                                type="button"
                                className="games-page__hero-button games-page__hero-button--primary"
                                onClick={() =>
                                    scrollToSection(exploreSectionRef.current)
                                }
                            >
                                Our Games
                            </button>
                            <button
                                type="button"
                                className="games-page__hero-button games-page__hero-button--secondary"
                                onClick={() =>
                                    scrollToSection(howToPlaySectionRef.current)
                                }
                            >
                                How to Play
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="games-page__explore" ref={exploreSectionRef}>
                <div className="page-container">
                    <h2 className="games-page__explore-title">
                        Explore our Games
                    </h2>
                    <div className="games-page__grid">
                        {featuredGames.map((game) => (
                            <GameCard
                                key={game.title}
                                title={game.title}
                                description={game.description}
                                imageUrl={game.imageUrl}
                                imageAlt={game.imageAlt}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="games-page__how-to-play"
                ref={howToPlaySectionRef}
            >
                <div className="page-container">
                    <h2 className="games-page__how-to-play-title">
                        How to Play
                    </h2>
                    <div className="games-page__how-to-play-grid">
                        {howToPlayGames.map((game) => (
                            <HowToPlayCard
                                key={game.title}
                                title={game.title}
                                videoSrc={game.videoSrc}
                                gamePageHref={game.gamePageHref}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default GamesPage;
