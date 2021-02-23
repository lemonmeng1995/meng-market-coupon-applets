<template>
	<view class="strategy">
		<view class="img-box">
			<image :src="strategy_image+this.$Fn.imageResize()" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				strategy_image: '',
			}
		},
		onLoad() {
			this.strategy_image = uni.getStorageSync('activityInfo').strategy_image
		},
		methods:{
		}
	}
</script>

<style lang="scss">
	.img-box {
		height: 100%;
		overflow: auto;

		image {
			width: 100%;
		}
	}

	.ui-btn-panel {
		height: 120rpx;
		line-height: 120rpx;
		background: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
		padding: 20rpx 24rpx;
		position: absolute;
		bottom: 0;
		width: 100%;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		z-index: 10;

		button {
			background: linear-gradient(95deg, rgb(213, 99, 255), rgb(116, 46, 254));
			color: rgb(255, 255, 255);
		}
	}
</style>
