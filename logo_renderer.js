function LogoRenderer(selector) {
    this.selector = selector;
    this.rotation_animation_offset = 0;
    // TODO resize callback

    let self = this;
    let animator = () => {
        self.animate();
        self.render();

        requestAnimationFrame(animator);
    };
    requestAnimationFrame(animator);
}

(() => {
'use strict';

/// All the 8 colors used
const context_flags = {
    alpha: true,
};
const colors = [ '247eff', '66a2f6', 'cabd4b', 'e6da6e', '5252c9', '7f7fe4', '09d4b0', '44f0d1', ];
const size = 42
    , n_slices = 16
    , rotation_animation_offset_step = 0.008;

// Poor mans use
const sin = Math.sin
    , cos = Math.cos
    , min = Math.min
    , pi = Math.PI;

/// Private functions
function i2pi(i) {
    return i / n_slices * 2 * pi;
}

/// Public functions
LogoRenderer.prototype = {
    animate: function() {
        if (this.rotation_animation_offset > pi) {
            this.rotation_animation_offset -= pi;
        }
        this.rotation_animation_offset += rotation_animation_offset_step;
    },


    render: function() {
        let ctx = document.querySelector(this.selector).getContext('2d', context_flags);
        const width = ctx.canvas.offsetWidth
            , height = ctx.canvas.offsetHeight
            , size = min(width, height)
            , rotation_animation_offset = this.rotation_animation_offset;
        var i = 0;

        // Fix relations
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        // Clean page
        ctx.fillStyle = '#eee';
        //ctx.fillRect(0,0, width, height);

        // Setup relative size
        const inner_radius = size/2
            , outer_radius = size/3;

        ctx.save();
        ctx.translate(width/2, height/2);

        const render_slice = (color) => {
            ctx.strokeStyle =
            ctx.fillStyle = '#'+color;
            let off = size*i;
            //ctx.fillRect(off, 0, size, size);

            ctx.beginPath()

            var normal_upper_x = sin(i2pi(i    ) + rotation_animation_offset)
              , normal_upper_y = cos(i2pi(i    ) + rotation_animation_offset);
            var normal_lower_x = sin(i2pi(i + 1) + rotation_animation_offset)
              , normal_lower_y = cos(i2pi(i + 1) + rotation_animation_offset);

            /*console.log([normal_upper_x * inner_radius, normal_upper_y * inner_radius])
            console.log([normal_upper_x * outer_radius, normal_upper_y * outer_radius])
            console.log([normal_lower_x * outer_radius, normal_lower_y * outer_radius])
            console.log([normal_lower_x * inner_radius, normal_lower_y * inner_radius])
            console.log('================')*/

            // inner upper
            ctx.moveTo(normal_upper_x * inner_radius, normal_upper_y * inner_radius);
            // outer upper
            ctx.lineTo(normal_upper_x * outer_radius, normal_upper_y * outer_radius);
            // outer lower
            ctx.lineTo(normal_lower_x * outer_radius, normal_lower_y * outer_radius);
            // inner lower
            ctx.lineTo(normal_lower_x * inner_radius, normal_lower_y * inner_radius);

            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            i += 1;
        }

        colors.forEach(render_slice);
        colors.forEach(render_slice);

        ctx.restore();
    }
};
})();
