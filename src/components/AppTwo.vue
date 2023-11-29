<template>
	<div class="app-container">
		<div class="box">
			<div class="item" :style="{
				'--r': setPositon(index).r,
				'--d': setPositon(index).d
			}" v-for="(item, index) in list" :key="index">
				{{ item }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		}
	},

	mounted() {
		const box = document.querySelector('.box')
		setTimeout(() => {
			box.classList.add('active')
		}, 500)
	},

	methods: {
		setPositon(index) {
			const r = (360 / this.list.length) * index
			const d = (this.list.length - index) * 0.2
			return { r: `${r}deg`, d: `${d}s` }
		}
	}
}
</script>

<style lang="less">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.app-container {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #011627;
	width: 100vw;
	height: 100vh;

	.box {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		position: relative;
		animation: rotate 10s linear infinite;

		.item {
			position: absolute;
			width: 30px;
			height: 30px;
			text-align: center;
			line-height: 30px;
			border-radius: 50%;
			background-color: darkcyan;
			color: #fff;
			left: calc(50% - 15px);
			top: -15px;
			transition: all 0.3s ease-in-out var(--d);
			// 改变子元素的变形原点，需要是容器的中心
			// x 中心即可， y 的为容器高度一半 + 子元素容器一半
			transform-origin: center 165px;
			opacity: 0;
		}

		&.active {
			.item {
				opacity: 1;
				transform: rotate(var(--r));
			}
		}
	}
}

@keyframes rotate {
	to {
		// transform: rotate(360deg);
	}
}
</style>
