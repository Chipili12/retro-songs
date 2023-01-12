import React, { useState, useEffect, useRef } from "react";

const Home = () => {
	const [numero, setnumero] = useState(0);
	const [sounds, setsounds] = useState([]);
	const [playing, setplaying] = useState(false);
	const audioRef = useRef(null);
	const progressBarRef = useRef(null);


	useEffect(() => {
		if (audioRef.current && progressBarRef.current) {
			progressBarRef.current.style.width = `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`;
		}
	}, [audioRef.current]);


	useEffect(() => {
		fetch('https://assets.breatheco.de/apis/sound/songs')
			.then((response) => response.json())
			.then((data) => setsounds(data))
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.src = 'https://assets.breatheco.de/apis/sound/' + sounds[numero].url;
			audioRef.current.play();
		}
	}, [numero]);

	const Play = (index) => {
		setnumero(index);
		setplaying(true);
		audioRef.current.play();
	}

	const pause = () => {
		setplaying(false);
		audioRef.current.pause();
	}

	if (sounds.length > 0 && numero >= 0 && numero < sounds.length) {
		return (
			<>
				<audio ref={audioRef} onTimeUpdate={() => {
						let currentTimePercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
						progressBarRef.current.style.width = currentTimePercent + "%";
				}} />
				<div className="wrapper bg-dark text-white">
					<ol>
						{sounds.map((item, index) => (
							<li key={index} className={index === numero && playing ? "bg-secondary" : "white"}>
								<button className="btn text-white" onClick={() => Play(index)}>{item.name}</button>
							</li>
						))}
					</ol>
					<div className="container sticky-bottom controles p-0">
						<div className="d-flex">
							<button className="btn btn-secondary ms-auto me-1" onClick={() => { setplaying(true); (numero == 0) ? setnumero(21) : setnumero(numero - 1) }} >&lt;</button>
							<button className="btn btn-secondary me-1" onClick={() => playing ? pause() : Play(numero)}>{playing ? "Pausar" : "Play"}</button>
							<button className="btn btn-secondary me-auto" onClick={() => { setplaying(true); (numero == 21) ? setnumero(0) : setnumero(numero + 1) }}> &gt; </button>
							<button className="btn btn-secondary ms-auto" onClick={() => { audioRef.current.volume -= 0.1; if (audioRef.current.volume < 0) audioRef.current.volume = 0; }}>-</button>
							<button className="btn btn-secondary ms-1" onClick={() => { audioRef.current.volume += 0.1; if (audioRef.current.volume > 1) audioRef.current.volume = 1; }}>+</button>

						</div>
						<div className="progress-bar" ref={progressBarRef}></div>
					</div>
				</div>
			</>
		);
	}
	return <div>Loading...</div>
};

export default Home;