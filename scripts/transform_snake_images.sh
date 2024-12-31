#!/bin/bash

# ./tmp/snake_images/以下の画像を回転、反転して画像を増やす
# すでにあるもの
# - snake_body_left_down.png
# - snake_body_left_right.png
# - snake_head_right.png
# - snake_tail_up.png

# 作成するもの
# - snake_body_{src}_{dst}.png
# - snake_head_{dst}.png
# - snake_tail_{src}.png
# src, dstはup, down, left, rightのいずれか
# srcは蛇の頭の方向、dstは蛇の尾の方向

# 画像の回転、反転にはImageMagickのconvertコマンドを使用

# snake_head_{dst}.pngを作成
# snake_head_upはsnake_head_rightを反時計回りに90度回転
convert ./tmp/snake_images/snake_head_right.png -rotate -90 ./tmp/snake_images/snake_head_up.png

# snake_head_downはsnake_head_rightを時計回りに90度回転
convert ./tmp/snake_images/snake_head_right.png -rotate 90 ./tmp/snake_images/snake_head_down.png

# snake_head_leftはsnake_head_rightを水平反転
convert ./tmp/snake_images/snake_head_right.png -flop ./tmp/snake_images/snake_head_left.png

# snake_tail_{src}.pngを作成

# snake_tail_downはsnake_tail_upを垂直反転
convert ./tmp/snake_images/snake_tail_up.png -flip ./tmp/snake_images/snake_tail_down.png

# snake_tail_leftはsnake_tail_upを反時計回りに90度回転
convert ./tmp/snake_images/snake_tail_up.png -rotate -90 ./tmp/snake_images/snake_tail_left.png

# snake_tail_rightはsnake_tail_upを時計回りに90度回転
convert ./tmp/snake_images/snake_tail_up.png -rotate 90 ./tmp/snake_images/snake_tail_right.png

# snake_body_{src}_{dst}.pngを作成

# snake_body_up_downはsnake_body_left_rightを時計回りに90度回転
convert ./tmp/snake_images/snake_body_left_right.png -rotate 90 ./tmp/snake_images/snake_body_up_down.png

# snake_body_up_leftはsnake_body_left_downを反時計回りに90度回転
convert ./tmp/snake_images/snake_body_left_down.png -rotate 90 ./tmp/snake_images/snake_body_up_left.png

# snake_body_up_rightはsnake_body_up_leftを水平反転
convert ./tmp/snake_images/snake_body_up_left.png -flop ./tmp/snake_images/snake_body_up_right.png

# snake_body_down_upはsnake_body_left_rightを反時計回りに90度回転
convert ./tmp/snake_images/snake_body_left_right.png -rotate -90 ./tmp/snake_images/snake_body_down_up.png

# snake_body_down_rightはsnake_body_left_downを反時計回りに90度回転
convert ./tmp/snake_images/snake_body_left_down.png -rotate -90 ./tmp/snake_images/snake_body_down_right.png

# snake_body_down_leftはsnake_body_down_rightを水平反転
convert ./tmp/snake_images/snake_body_down_right.png -flop ./tmp/snake_images/snake_body_down_left.png

# snake_body_left_upはsnake_body_left_downを垂直反転
convert ./tmp/snake_images/snake_body_left_down.png -flip ./tmp/snake_images/snake_body_left_up.png

# snake_body_right_upはsnake_body_left_upを水平反転
convert ./tmp/snake_images/snake_body_left_up.png -flop ./tmp/snake_images/snake_body_right_up.png

# snake_body_right_downはsnake_body_left_downを水平反転
convert ./tmp/snake_images/snake_body_left_down.png -flop ./tmp/snake_images/snake_body_right_down.png

# snake_body_right_leftはsnake_body_left_rightを水平反転
convert ./tmp/snake_images/snake_body_left_right.png -flop ./tmp/snake_images/snake_body_right_left.png
