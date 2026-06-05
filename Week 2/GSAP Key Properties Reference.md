# GSAP Key Properties Reference

GSAP cheatsheet: https://gsap.com/cheatsheet/ 

| **Property** | **Example value** | **What it does** |
| --- | --- | --- |
| duration | 0.8 | Seconds the animation takes. Default: 0.5 |
| ease | 'power2.out' | The velocity curve. More below. |
| delay | 0.3 | Wait this many seconds before starting |
| repeat | -1 | How many times to repeat. -1 = infinite |
| yoyo | true | Alternate direction each repeat (ping-pong) |
| stagger | 0.1 | Delay between each element when targeting many |
| onComplete | () => {} | Callback when animation finishes |
| onStart | () => {} | Callback when animation starts |
| onUpdate | () => {} | Callback every frame — for syncing other things |
| paused | true | Create the tween but don't play it yet |
| overwrite | 'auto' | Handle conflicting tweens on same element |
