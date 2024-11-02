precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// A classic 2D random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// A 2D noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion for richer, layered noise
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Main color generation function
vec3 getColor(vec2 st) {
    // Generate a flowing pattern by applying fbm and coordinate offsets
    float angle = fbm(st + u_time * 0.05) * 3.14;
    vec2 offset = vec2(cos(angle), sin(angle)) * 0.2;
    
    // Distort coordinates based on noise for a viscous look
    float n = fbm(st * 4.0 + offset);
    float m = fbm(st * 8.0 - offset);
    
    // Define a vivid color palette similar to the reference image
    vec3 color1 = vec3(0.9, 0.2, 0.2); // Red
    vec3 color2 = vec3(0.2, 0.6, 0.3); // Green
    vec3 color5 = vec3(0.1, 0.4, 0.7); // Blue
    vec3 color4 = vec3(0.9, 0.8, 0.1); // Yellow
    vec3 color3 = vec3(1.0, 0.5, 0.8); // Pink

    // Mixing colors based on noise patterns
    vec3 color = mix(color1, color2, n);
    color = mix(color, color3, m * 0.6 + 0.4);
    color = mix(color, color4, abs(sin(n * 3.14 + u_time * 0.1)));
    color = mix(color, color5, abs(cos(m * 3.14 - u_time * 0.15)));

    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    // Apply slight time-based distortions to st to create the swirling effect
    st += 0.1 * vec2(sin(u_time * 0.1), cos(u_time * 0.1));
    st += 0.1 * vec2(sin(st.y * 10.0 + u_time * 0.2), cos(st.x * 10.0 - u_time * 0.2));

    // Get the final color based on distorted coordinates
    vec3 color = getColor(st);

    gl_FragColor = vec4(color, 1.0);
}
