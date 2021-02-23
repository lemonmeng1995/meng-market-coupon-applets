<template>
	<view class="agreement">
		<view v-html="agreement">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreement: ''
			}
		},
		onLoad() {
			this.agreement = uni.getStorageSync('activityInfo').agreement
		}
	}
</script>

<style lang="scss">
	.agreement {
		padding: 20rpx;
	}
</style>
