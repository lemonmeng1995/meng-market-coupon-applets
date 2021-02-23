<template>
	<div :class="isIPX ? 'isIpx footer v2-footer':'footer v2-footer'">
		<view class="ulname">
			<view class="liname" v-for="(item, index) in footer_tabs" :key="index" @click="toggle_component(item.router, index)">
				<image :src="index == tabIndex ? item.icon : item.default_icon" alt="首页" srcset />
				<text :class="{ tab_cur_color: index == tabIndex }">{{ item.txt }}</text>
			</view>
		</view>
	</div>
</template>

<script>
	export default {
		props: {
			tabIndex: {
				type: Number
			},
			footer_tabs: {
				type: Array
			},
		},
		data() {
			return {
				isIPX: this.$Cf.configData.isIPX,
			};
		},
		methods: {
			toggle_component(router, index) {
				let page = this
				page.$emit('tabChange', index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 底部tab导航
	.isIpx {
		height: 178rpx !important;
		padding-bottom: 68rpx !important;
	}

	.footer {
		width: 100%;
		height: 110rpx;
		background-color: #fff;
		z-index: 9999999;
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding-top: 10rpx;
		box-shadow: 0rpx 2rpx 7rpx 0rpx rgba(179, 145, 237, 0.57);

		.ulname {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 100%;

			.qiang_img {
				flex: 2;
				margin-left: 2%;

				img {
					width: 360rpx;
					height: 92rpx;
				}
			}

			.liname {
				display: flex;
				align-items: center;
				flex-direction: column;
				width: 160rpx;

				image {
					display: block;
					width: 58rpx;
					height: 58rpx;
				}

				text {
					font-size: 22rpx;
					font-weight: bold;
					color: #8e8e8e;
					line-height: 32rpx;
					margin-top: 4rpx;
				}

				.tab_cur_color {
					color: #7b4fc7 !important;
				}
			}
		}
	}
</style>
