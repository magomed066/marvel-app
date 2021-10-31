import './charInfo.scss'
import { useEffect, useState } from 'react'
import useMarvelService from '../../services/MarvelService'
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../error/ErrorMessage'
import Skeleton from '../skeleton/Skeleton'

const CharInfo = ({ charId }) => {
	const [char, setChar] = useState(null)
	const { loading, error, getCharacter, clearError } = useMarvelService()

	useEffect(() => {
		updateChar()
	}, [charId])

	const updateChar = () => {
		if (!charId) {
			return
		}

		clearError()

		getCharacter(charId).then(onCharLoaded)
	}

	const onCharLoaded = (char) => {
		setChar(char)
	}

	const skeleton = char || loading || error ? null : <Skeleton />

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null

	const content = !(loading || error || !char) ? <View char={char} /> : null

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)
}

const View = ({ char }) => {
	const { name, desctiption, thumbnail, homepage, wiki, comics } = char

	const notAvailableImg = thumbnail.split('/')

	const transformComics = (arr = []) => {
		if (!arr.length) {
			return []
		}

		const start = 0
		const end = 10
		return arr.slice(start, end)
	}

	return (
		<>
			<div className="char__basics">
				<img
					src={thumbnail}
					alt={name}
					style={{
						objectFit:
							notAvailableImg[notAvailableImg.length - 1] ===
								'image_not_available.jpg' && 'contain',
					}}
				/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{desctiption}</div>
			<div className="char__comics">Comics:</div>
			{!comics.length ? (
				<span>Comics not found :)</span>
			) : (
				<ul className="char__comics-list">
					{transformComics(comics).map((item) => (
						<li key={item.name} className="char__comics-item">
							{item.name}
						</li>
					))}
				</ul>
			)}
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number,
}

export default CharInfo
