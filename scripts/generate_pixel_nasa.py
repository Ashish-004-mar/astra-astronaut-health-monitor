import math
import os
from PIL import Image, ImageDraw

def create_pixel_nasa_gif():
    # Base low-res pixel buffer size for authentic retro-pixel aesthetics
    W, H = 200, 200
    SCALE = 2 # Output size: 400x400
    OUT_W, OUT_H = W * SCALE, H * SCALE

    CX, CY = W // 2, H // 2
    SPHERE_R = 40 # Radius in pixel units

    # Palette
    BG_COLOR = (5, 8, 18, 255) # Deep cosmic aerospace dark navy
    SPACE_STARS = [
        (15, 20, 210), (32, 75, 140), (175, 22, 220), (188, 145, 180),
        (22, 168, 150), (165, 182, 230), (82, 16, 120), (148, 8, 190),
        (10, 118, 140), (192, 82, 160), (42, 192, 190), (112, 195, 150),
        (78, 42, 100), (128, 158, 120), (12, 78, 80), (185, 172, 170),
        (52, 108, 130), (172, 58, 200), (92, 182, 110), (28, 38, 150),
        (95, 95, 240), (105, 30, 190), (140, 190, 210), (60, 170, 130)
    ]

    # NASA Colors
    SPHERE_DARK = (4, 18, 52)
    SPHERE_MID = (11, 61, 145)       # Official NASA Meatball Blue
    SPHERE_BRIGHT = (24, 98, 210)
    SPHERE_HIGHLIGHT = (52, 148, 255)
    SPHERE_RIM = (0, 235, 255)       # Cyber-Cyan rim

    CHEVRON_RED = (252, 61, 33)      # Official NASA Red
    CHEVRON_BRIGHT = (255, 120, 90)
    CHEVRON_DARK = (170, 25, 15)

    TEXT_WHITE = (255, 255, 255)

    RING1_CORE = (0, 245, 255)       # Cyan ring core
    RING1_GLOW = (0, 150, 240)
    RING1_DARK = (0, 60, 120)

    RING2_CORE = (255, 190, 20)      # Amber/Gold ring core
    RING2_GLOW = (255, 120, 0)
    RING2_DARK = (130, 50, 0)

    RING3_CORE = (200, 130, 255)     # Magenta/Purple orbital ring core
    RING3_GLOW = (130, 60, 220)
    RING3_DARK = (60, 20, 120)

    # 5x7 Pixel font for NASA
    PIXEL_FONT = {
        'N': [
            "10001",
            "11001",
            "10101",
            "10011",
            "10001",
            "10001",
            "10001"
        ],
        'A': [
            "01110",
            "10001",
            "10001",
            "11111",
            "10001",
            "10001",
            "10001"
        ],
        'S': [
            "01111",
            "10000",
            "10000",
            "01110",
            "00001",
            "00001",
            "11110"
        ]
    }

    # Pre-render Sphere Base & Lighting with Dithering
    sphere_pixels = {}
    for y in range(-SPHERE_R, SPHERE_R + 1):
        for x in range(-SPHERE_R, SPHERE_R + 1):
            d2 = x * x + y * y
            if d2 <= SPHERE_R * SPHERE_R:
                z = math.sqrt(SPHERE_R * SPHERE_R - d2)
                # Normal vector
                nx = x / SPHERE_R
                ny = y / SPHERE_R
                nz = z / SPHERE_R

                # Light direction: top-left-front
                lx, ly, lz = -0.50, -0.55, 0.67
                diff = nx * lx + ny * ly + nz * lz

                # Rim light: edges facing away from camera
                rim = 1.0 - nz

                # Ordered 2x2 Dither matrix value
                dither = ((x % 2) * 2 + (y % 2)) / 4.0 - 0.5
                effective_diff = diff + dither * 0.15

                if rim > 0.88 and diff > -0.2:
                    col = SPHERE_RIM
                elif effective_diff > 0.45:
                    col = SPHERE_HIGHLIGHT
                elif effective_diff > 0.15:
                    col = SPHERE_BRIGHT
                elif effective_diff > -0.25:
                    col = SPHERE_MID
                else:
                    col = SPHERE_DARK

                # Add tiny white stars on planet surface like NASA meatball
                if (x * 11 + y * 17) % 53 == 0 and z > 15:
                    col = (220, 240, 255)

                sphere_pixels[(x, y)] = (col, z)

    # Precompute NASA Supersonic Red Chevron:
    # Iconic NASA red chevron is an aeronautical wing swept back like a '<' or 'V' on its side
    # Crossing the sphere from upper-left, dipping across the center, and splitting right
    chevron_pixels = set()
    # Upper sweep of chevron
    for t in range(-45, 48):
        # Parametric spline for top wing
        cx1 = int(t * 0.95 - 2)
        cy1 = int(-14 + (t * 0.35) - 0.008 * (t * t))
        for dx in range(-2, 3):
            for dy in range(-2, 3):
                if dx*dx + dy*dy <= 4:
                    chevron_pixels.add((cx1 + dx, cy1 + dy))
        # Lower sweep of chevron
        cx2 = int(t * 0.85 + 4)
        cy2 = int(10 + (t * 0.25) + 0.007 * (t * t))
        for dx in range(-2, 3):
            for dy in range(-2, 3):
                if dx*dx + dy*dy <= 4:
                    chevron_pixels.add((cx2 + dx, cy2 + dy))

    NUM_FRAMES = 40
    frames = []

    for f in range(NUM_FRAMES):
        phase = (2.0 * math.pi * f) / NUM_FRAMES

        # Create low-res frame
        img = Image.new("RGBA", (W, H), BG_COLOR)
        draw = ImageDraw.Draw(img)

        # Draw deep-space twinkling stars
        for i, (sx, sy, brightness) in enumerate(SPACE_STARS):
            twinkle = int(brightness + 45 * math.sin(phase * 2 + i * 1.3))
            twinkle = max(40, min(255, twinkle))
            if (sx + sy) % 3 == 0:
                draw.point((sx, sy), fill=(twinkle, twinkle, 255, 255))
            else:
                draw.point((sx, sy), fill=(twinkle, int(twinkle * 0.9), int(twinkle * 0.75), 255))

        # Generate Ring 1 (Cyan Orbit - 3D Inclined 66 deg, Precessing)
        # Ring 1 radius: 60 px
        r1_pts = []
        for a_deg in range(0, 360, 2):
            th = math.radians(a_deg) + phase # Auto-rotating angle
            rx = 62 * math.cos(th)
            ry = 0
            rz = 62 * math.sin(th)

            inc1 = math.radians(65)
            y1 = ry * math.cos(inc1) - rz * math.sin(inc1)
            z1 = ry * math.sin(inc1) + rz * math.cos(inc1)

            yaw1 = math.radians(24)
            x_rot = rx * math.cos(yaw1) - y1 * math.sin(yaw1)
            y_rot = rx * math.sin(yaw1) + y1 * math.cos(yaw1)

            r1_pts.append((int(CX + x_rot), int(CY + y_rot), z1, 1, a_deg))

        # Generate Ring 2 (Amber/Gold Orbit - 3D Inclined -52 deg, Counter-rotating)
        r2_pts = []
        for a_deg in range(0, 360, 3):
            th = math.radians(a_deg) - phase * 1.15
            rx = 70 * math.cos(th)
            ry = 0
            rz = 70 * math.sin(th)

            inc2 = math.radians(-52)
            y2 = ry * math.cos(inc2) - rz * math.sin(inc2)
            z2 = ry * math.sin(inc2) + rz * math.cos(inc2)

            yaw2 = math.radians(-35)
            x_rot = rx * math.cos(yaw2) - y2 * math.sin(yaw2)
            y_rot = rx * math.sin(yaw2) + y2 * math.cos(yaw2)

            r2_pts.append((int(CX + x_rot), int(CY + y_rot), z2, 2, a_deg))

        # Generate Ring 3 (Deep Purple Orbit - 3D Inclined 28 deg with Satellite)
        r3_pts = []
        sat_pos = None
        for a_deg in range(0, 360, 3):
            th = math.radians(a_deg) + phase * 0.9
            rx = 82 * math.cos(th)
            ry = 0
            rz = 82 * math.sin(th)

            inc3 = math.radians(28)
            y3 = ry * math.cos(inc3) - rz * math.sin(inc3)
            z3 = ry * math.sin(inc3) + rz * math.cos(inc3)

            yaw3 = math.radians(-68)
            x_rot = rx * math.cos(yaw3) - y3 * math.sin(yaw3)
            y_rot = rx * math.sin(yaw3) + y3 * math.cos(yaw3)

            pt = (int(CX + x_rot), int(CY + y_rot), z3, 3, a_deg)
            r3_pts.append(pt)
            if a_deg == 0:
                sat_pos = (int(CX + x_rot), int(CY + y_rot), z3)

        # Depth sorting: Behind the sphere (z < 0)
        all_ring_pts = r1_pts + r2_pts + r3_pts
        back_ring_pts = [p for p in all_ring_pts if p[2] < 0]
        front_ring_pts = [p for p in all_ring_pts if p[2] >= 0]

        # Draw Back Rings (Behind the sphere)
        for px, py, pz, r_type, a_deg in back_ring_pts:
            if 0 <= px < W and 0 <= py < H:
                if r_type == 1:
                    col = RING1_DARK if pz < -30 else RING1_GLOW
                elif r_type == 2:
                    col = RING2_DARK if pz < -30 else RING2_GLOW
                else:
                    col = RING3_DARK if pz < -30 else RING3_GLOW
                draw.point((px, py), fill=col)

        # Draw 3D Pixel NASA Sphere Body
        for (sx, sy), (col, z) in sphere_pixels.items():
            screen_x = CX + sx
            screen_y = CY + sy

            pixel_col = col

            # Check if this pixel is part of the Red Chevron
            if (sx, sy) in chevron_pixels:
                if sx > 12 and sy < -5:
                    pixel_col = CHEVRON_BRIGHT
                elif sy > 18 or sx < -18:
                    pixel_col = CHEVRON_DARK
                else:
                    pixel_col = CHEVRON_RED

            draw.point((screen_x, screen_y), fill=pixel_col)

        # Draw Pixel NASA Typography centered on sphere
        nasa_str = "NASA"
        start_tx = CX - 12
        start_ty = CY - 4
        # Add subtle vertical hover bounce
        bounce_y = int(math.sin(phase) * 1.5)
        start_ty += bounce_y

        cur_tx = start_tx
        for char in nasa_str:
            grid = PIXEL_FONT[char]
            for row_idx, row_str in enumerate(grid):
                for col_idx, ch_val in enumerate(row_str):
                    if ch_val == '1':
                        tx = cur_tx + col_idx
                        ty = start_ty + row_idx
                        dx = tx - CX
                        dy = ty - CY
                        if dx*dx + dy*dy < (SPHERE_R - 2) * (SPHERE_R - 2):
                            # Contrast shadow
                            draw.point((tx + 1, ty + 1), fill=(2, 10, 30))
                            draw.point((tx, ty), fill=TEXT_WHITE)
            cur_tx += 6

        # Draw Front Rings (Passing in front of sphere with bright neon glow)
        for px, py, pz, r_type, a_deg in front_ring_pts:
            if 0 <= px < W and 0 <= py < H:
                if r_type == 1:
                    col = RING1_CORE if pz > 30 else RING1_GLOW
                    draw.point((px, py), fill=col)
                    # Dense glowing bead along the ring
                    if a_deg % 8 == 0:
                        draw.point((px + 1, py), fill=RING1_GLOW)
                        draw.point((px, py + 1), fill=RING1_GLOW)
                elif r_type == 2:
                    col = RING2_CORE if pz > 30 else RING2_GLOW
                    draw.point((px, py), fill=col)
                    if a_deg % 10 == 0:
                        draw.point((px + 1, py), fill=RING2_GLOW)
                else:
                    col = RING3_CORE if pz > 30 else RING3_GLOW
                    draw.point((px, py), fill=col)

        # Draw Orbiting Pixel Satellite (ISS / Exploration Probe)
        if sat_pos:
            spx, spy, spz = sat_pos
            if 0 <= spx < W and 0 <= spy < H:
                # Central bus
                draw.rectangle([spx - 1, spy - 1, spx + 1, spy + 1], fill=(255, 255, 255))
                # Solar wings (cyan solar arrays)
                draw.rectangle([spx - 5, spy, spx - 2, spy], fill=(0, 230, 255))
                draw.rectangle([spx + 2, spy, spx + 5, spy], fill=(0, 230, 255))
                # Beacon flash
                if (f // 5) % 2 == 0:
                    draw.point((spx, spy - 2), fill=(255, 60, 60))
                else:
                    draw.point((spx, spy + 2), fill=(0, 255, 120))

        # High-tech HUD telemetry brackets in corners
        hud_col = (0, 210, 255, 180)
        # Top-left
        draw.line([(8, 8), (22, 8)], fill=hud_col)
        draw.line([(8, 8), (8, 22)], fill=hud_col)
        # Top-right
        draw.line([(W - 9, 8), (W - 23, 8)], fill=hud_col)
        draw.line([(W - 9, 8), (W - 9, 22)], fill=hud_col)
        # Bottom-left
        draw.line([(8, H - 9), (22, H - 9)], fill=hud_col)
        draw.line([(8, H - 9), (8, H - 23)], fill=hud_col)
        # Bottom-right
        draw.line([(W - 9, H - 9), (W - 23, H - 9)], fill=hud_col)
        draw.line([(W - 9, H - 9), (W - 9, H - 23)], fill=hud_col)

        # Upscale frame with crisp Nearest Neighbor
        high_res = img.resize((OUT_W, OUT_H), Image.Resampling.NEAREST)
        frames.append(high_res)

    # Save to docs/assets and public/assets
    os.makedirs("docs/assets", exist_ok=True)
    os.makedirs("public/assets", exist_ok=True)

    gif_path_docs = "docs/assets/nasa-pixel-3d-rings.gif"
    gif_path_public = "public/assets/nasa-pixel-3d-rings.gif"

    frames[0].save(
        gif_path_docs,
        save_all=True,
        append_images=frames[1:],
        duration=40, # 25 FPS smooth rotation
        loop=0,
        optimize=True
    )

    frames[0].save(
        gif_path_public,
        save_all=True,
        append_images=frames[1:],
        duration=40,
        loop=0,
        optimize=True
    )

    print(f"Generated successfully: {gif_path_docs} ({os.path.getsize(gif_path_docs)} bytes)")

if __name__ == "__main__":
    create_pixel_nasa_gif()
