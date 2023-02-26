
# Stable-Diffusion-Webui-Api Discord-Bot

디스코드 봇을 통해 Stable-Diffusion-WebUI에 명령어를 보내 png 파일을 생성하고, 그 결과값을 디스코드에 파일 첨부 기능을 통해 출력하는 봇입니다.
Bot that sends commands to Stable-Diffusion-WebUI via Discord, generates PNG files, and outputs the result to Discord via file attachment feature.
(The English article was translated with the help of ChatGPT)

  

## [Development Environment]

Language : node.js v18.14
OS : Windows 11

## [Requirements]
1. API 모드로 실행되고 있는 로컬 Stable-Diffusion-WebUI에 접속 가능한 주소 필요.
Stable-Diffusion-WebUI를 실행할 때, webui.bat파일 (혹은 Stable-Diffusion-WebUI를 실행하는 다른 bat 파일)에 set COMMANDLINE_ARGS 설정에 --api를 추가해야 함.

2. 사용할 디스코드 봇을 생성해야 함.
https://discord.com/developers/applications에서 봇 생성.

---

1. Requires a URL that can connect to the local Stable-Diffusion-WebUI running in API mode.
When running Stable-Diffusion-WebUI, the webui.bat file (or another bat file used to run Stable-Diffusion-WebUI) must have --api added to the set COMMANDLINE_ARGS configuration.

2. You need to create a Discord bot to use.
Create a bot at https://discord.com/developers/applications.


## [Usage]

1. 프로젝트를 다운 받은 이후 "npm install" 명령어을 통해 필요한 모듈을 설치합니다.
2. 디스코드 봇의 권한은 [Send Messages / Embed Links / Attach Files / Use Slash Commands] 가 필요합니다. 해당 권한이 부여된 봇을 사용 원하는 채널에 초대합니다.
3. config.json 파일에 자신이 만든 봇의 정보, 사용할 채널의 정보를 토대로 clientId, guildId, token 정보를 입력합니다. (guildID는 서버 설정에서 확인 할 수 있습니다)
4. config.json 파일에 자신이 접속할 Stable-Diffusion-WebUI API 정보를 url_txt, url_i2i 주소 정보를 입력합니다.
5. "node main.js" 명령어를 입력해 봇에 접속합니다.
6. "node deploy-commands.js" 명령어를 통해 디스코드 명령어를 등록합니다.
7. 디스코드에서 /prompt_normal, /prompt_hard /prompt_i2i 명령어를 통해 사용합니다.

---

1. After downloading the project, install the necessary modules using the command "npm install".
2. The Discord bot requires the following permissions: [Send Messages / Embed Links / Attach Files / Use Slash Commands]. Invite the bot with the appropriate permissions to the desired channel.
3. In the config.json file, enter the clientID, guildID, and token information for the bot you created based on the information for the channel you want to use. (You can find the guildID in server settings.)
4. In the config.json file, enter the url_txt and url_i2i information for the Stable-Diffusion-WebUI API you want to access.
5. Connect to the bot by entering the command "node main.js".
6. Register discord commands using the command "node deploy-commands.js".
7. Use discord commands "/prompt_normal", "/prompt_hard", and "/prompt_i2i".


## [Commands]

1. /prompt_normal 
초보자들을 위해 단순한 명령어 입력을 통해 이미지를 제작 할 수 있는 명령어입니다. 기본적인 negative_tags들이 포함되어 있습니다.
tags : 이미지 생성에 사용할 태그
negative_tags : 이미지 생성에 사용할 negative 태그
quality : 해상도
step : Sampling step
sacle : CFG sacle
spoiler : 디스코드 이미지 스포일러 여부

2. /prompt_hard
숙련자들을 위해 조금 더 다양한 옵션 값을 제작 할 수 있는 명령어입니다.
tags : 이미지 생성에 사용할 태그
negative_tags : 이미지 생성에 사용할 negative 태그
quality : 해상도
step : Sampling step
sampler : 사용할 Sampling method
sacle : CFG sacle
batch : 한 번에 생성할 이미지 갯수
spoiler : 디스코드 이미지 스포일러 여부

3. /prompt_i2i
기존에 존재하는 이미지를 수정하기 위한 i2i 기능을 사용 할 수 있는 명령어입니다.
image_url : 기존 이미지 주소
strength : Denoising streangth
tags : 이미지 생성에 사용할 태그
negative_tags : 이미지 생성에 사용할 negative 태그
quality : 해상도
step : Sampling step
sampler : 사용할 Sampling method
sacle : CFG sacle
batch : 한 번에 생성할 이미지 갯수
spoiler : 디스코드 이미지 스포일러 여부

---

1. /prompt_normal
This command allows beginners to create images by simply entering simple commands. It includes basic negative tags.
tags: tags to be used for image generation
negative_tags: negative tags to be used for image generation
quality: resolution
step: sampling step
scale: CFG scale
spoiler: whether to enable Discord image spoiler

2. /prompt_hard
This command allows experienced users to create images with more various option values.
tags: tags to be used for image generation
negative_tags: negative tags to be used for image generation
quality: resolution
step: sampling step
sampler: sampling method to use
scale: CFG scale
batch: number of images to generate at once
spoiler: whether to enable Discord image spoiler

3. /prompt_i2i
This command allows the use of the i2i function to modify existing images.
image_url: URL of the existing image
strength: denoising strength
tags: tags to be used for image generation
negative_tags: negative tags to be used for image generation
quality: resolution
step: sampling step
sampler: sampling method to use
scale: CFG scale
batch: number of images to generate at once
spoiler: whether to enable Discord image spoiler
  


## [Use Documents]

1. stable-diffusion-webui
https://github.com/AUTOMATIC1111/stable-diffusion-webui

2. discord.js
https://discord.js.org/
  

## [Licenses]

MIT License