<template>
	<view class="customIndex">
		<image :src="url+this.$Fn.imageResize()" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				url:''
			}
		},
		onLoad(e) {
			this.url = e.src;
		}
	}
</script>

<style lang="scss">
	.customIndex{
		width: 100%;
		image{
			width: 100%;
		}
	}
</style>
