function LogoRenderer(selector) {
    this.selector = selector;
    this.rotation_animation_offset = 0;
    this.fancy_triangles = Math.random() < 0.1// || true;

    let powersave = true;

    let self = this;
    let animator = () => {
        self.animate();
        self.render();

        if (powersave) {
            setTimeout(() => requestAnimationFrame(animator), 1000/30);
        } else {
            requestAnimationFrame(animator);
        }
    };
    requestAnimationFrame(animator);

    navigator.getBattery().then((b) => {
        powersave = !b.charging;
    });
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
            , rotation_animation_offset = this.rotation_animation_offset
            , fancy = this.fancy_triangles;
        var i = 0;

        // Fix relations
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        // Clean page
        //ctx.fillStyle = '#eee';
        //ctx.fillRect(0,0, width, height);

        // Setup relative size
        const nose_height = size/4.2
            , inner_radius = size/3
            , outer_radius = size/2.3
            , tail_height = size/2;

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

            // inner lower
            ctx.moveTo(normal_lower_x * inner_radius, normal_lower_y * inner_radius);
            // dark inner
            if (fancy && i % 4 == 0) {
                var normal_middle_x = sin(i2pi(i + 0.5) + rotation_animation_offset)
                  , normal_middle_y = cos(i2pi(i + 0.5) + rotation_animation_offset);

                ctx.lineTo(normal_middle_x * nose_height, normal_middle_y * nose_height);
            }
            // inner upper
            ctx.lineTo(normal_upper_x * inner_radius, normal_upper_y * inner_radius);
            // outer upper
            ctx.lineTo(normal_upper_x * outer_radius, normal_upper_y * outer_radius);

            // light outer before
            if (fancy && i % 2 == 1) {
                var normal_tail_far_x = sin(i2pi(i - 1) + rotation_animation_offset)
                  , normal_tail_far_y = cos(i2pi(i - 1) + rotation_animation_offset);

                // far outer
                ctx.lineTo(normal_tail_far_x * outer_radius, normal_tail_far_y * outer_radius);
                // far tail
                ctx.lineTo(normal_tail_far_x * tail_height, normal_tail_far_y * tail_height);
                // tail
                ctx.lineTo(normal_upper_x * tail_height, normal_upper_y * tail_height);
                // outer upper
                ctx.lineTo(normal_upper_x * outer_radius, normal_upper_y * outer_radius);
            }
            // outer lower
            ctx.lineTo(normal_lower_x * outer_radius, normal_lower_y * outer_radius);

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
