const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const Promise = require('promise');
const fs = require("fs");
require('date-utils');

const func = {};

const { url_txt } = require('../config.json');
//const url_txt = "http://127.0.0.1:7860/sdapi/v1/txt2img"

let number = 0;

func.createTxt2Img2 = async (this_number, tags, negative_tags, quality, step, scale, file_name) => {
    return new Promise(async (resolve, reject) => {

        let width;
        let height;

        if(quality == 2) {
            width = 512;
            height = 768;
        } else if(quality == 1) {
            width = 960;
            hieght = 540;
        } else {
            width = 640;
            height = 360;
        }

        negative_tags = `(worst quality, low quality:1.4), (realistic, lip, nose, tooth, rouge, lipstick, eyeshadow:1.0), (dusty sunbeams:1.0),, (abs, muscular, rib:1.0), (depth of field, bokeh, blurry:1.4), (greyscale, monochrome:1.0), text, title, logo, signature, ${negative_tags}`;

        fetch(url_txt, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ 
                
                    "prompt": tags,
                    "negative_prompt": negative_tags,
                    "steps": step,
                    "cfg_scale": scale,
                    "width": width,
                    "height": height,
                    "sampler_index": "DPM++ 2M Karras",
                    "batch_size": 1,
                    "hr_scale": 2,
                    "hr_upscaler": "Latenet (nearest-exact)",
                    "denoising_strength": 0.5
            })
        }).then((response) => 
            response.json()
        ).then((data) => {
            console.log(this_number + " DATA : ");
            console.log(data)

            let imgbase64 = data.images[0];
            let base64String = 'data:image/png;base64,' + imgbase64; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();
            fs.writeFile(file_name + '_1.png', base64Image, {encoding: 'base64'}, function(err) {
                console.log("write file created");
                if(!err || err === undefined || err.length == 0) {
                    return resolve(this_number);
                } else {
                    console.log("write file error : " , err);
                    return reject(err);
                }
            });
        })
        .catch(error => {
            console.warn(error);
            return reject(error);
        });
    });
};




module.exports = {
	data: new SlashCommandBuilder()
		.setName('prompt_normal')
		.setDescription('please input image tags and options')
        .addStringOption(option =>
            option.setName('tags')
                .setDescription('tags list')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('negative_tags')
                .setDescription('negative tags list')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('quality')
                .setDescription('해상도를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '512x768', value: '2' },
                    { name: 'HD', value: '0' },
                    { name: 'FHD', value: '1' }
                ))
        .addStringOption(option =>
            option.setName('step')
                .setDescription('샘플링횟수')
                .setRequired(true)
                .addChoices(
                    { name: '20', value: '20' },
                    { name: '24', value: '24' },
                    { name: '30', value: '30' },
                ))
        .addStringOption(option =>
            option.setName('scale')
                .setDescription('태그 스케일 강도')
                .setRequired(true)
                .addChoices(
                    { name: '적음', value: '6' },
                    { name: '보통', value: '8' },
                    { name: '엄격', value: '11' },
                ))
        .addStringOption(option =>
            option.setName('spoiler')
                .setDescription('스포일러여부')
                .setRequired(true)
                .addChoices(
                    { name: 'Y', value: '1' },
                    { name: 'N', value: '0' }
                )),
	async execute(interaction) {

        let newDate = new Date();
        let this_number = newDate.toFormat('YYYYMMDDHH24MISS');
        //let this_number = number++;
        const tags = interaction.options.getString('tags') ?? '';
        const negative_tags = interaction.options.getString('negative_tags') ?? '';
        const quality = interaction.options.getString('quality') ?? '';
        const step = interaction.options.getString('step') ?? '';
        const scale = interaction.options.getString('scale') ?? '';
        const spoiler = interaction.options.getString('spoiler') ?? '1';

        let file_name;

        if(spoiler == 0) { //false
            file_name = "output/" + this_number;
        } else { //true
            file_name = "output/SPOILER_" + this_number;
        }

        console.log(`input tags : ${tags}`);
        console.log(`input negative tags : ${negative_tags}`);
        await interaction.deferReply();

        await func.createTxt2Img2(this_number, tags, negative_tags, quality, step, scale, file_name)
        .then(async (returns) => {

            try {
                console.log("createTxt2Img return : " , returns);

                const file = new AttachmentBuilder(file_name + '_1.png');
                const exampleEmbed = new EmbedBuilder()
                    .setTitle('만들어진 이미지')
                    .setImage('attachment://' + file_name + '_1.png');
                
                    interaction.channel.send({ embeds: [exampleEmbed], files: [file] });

                    await wait(100);
                    await interaction.editReply(`input tag : ${tags} / nagative_tag : ${negative_tags}`);
            } catch (e) {
                console.log("createTxt2Img2 exception : " , e);
                await wait(100);
                await interaction.editReply(`IMAGE CREATE ERROR`);
            }


        }).catch(async (error) => {
            console.log("createTxt2Img error : " , error);

            await wait(100);
            await interaction.editReply(`IMAGE CREATE ERROR`);
        });
        
	},
};




