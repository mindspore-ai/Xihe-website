<script setup>
import performance from '@/assets/imgs/codegeex/performance.png';
import framework from '@/assets/imgs/codegeex/framework.png';
import baseline from '@/assets/imgs/codegeex/baseline.png';
import codeGeneration from '@/assets/imgs/codegeex/code-generation.png';
import codeGeneration2 from '@/assets/imgs/codegeex/code-generation2.png';
import formula from '@/assets/imgs/codegeex/formula.png';

const feature = [
  {
    title: '• 多语言代码生成：',
    info: 'CodeGeeX支持Python、C++、Java、JavaScript、Go等多种主流编程语言的高精度生成，性能超越现有其他开源基础模型。',
  },
  {
    title: '• 跨语言代码翻译：',
    info: 'CodeGeeX支持不同语言之间的代码片段翻译。只需点击一下，CodeGeeX就可以将程序在几种主流语言中进行高精度转换。',
    linkText: '[体验翻译]',
    link: 'https://models.aminer.cn/codegeex/zh-CN/codeTranslator',
  },
  {
    title: '• 自动编程插件：',
    info: 'CodeGeeX插件现已上架VS Code插件市场（完全免费）。它支持代码补全、翻译、解释等功能，并支持自定义提示模式，为用户提供更好的编程体验。',
    linkText: '[插件下载]',
    link: 'https://marketplace.visualstudio.com/items?itemName=aminer.codegeex',
  },
  {
    title: '• 开源和跨平台：',
    info: '所有代码和模型权重开源，可用于研究用途。CodeGeeX同时支持昇腾和英伟达平台，可在单张昇腾910或英伟达3090/V100/A100上实现推理。',
    linkText: '[开源代码]',
    link: 'https://github.com/THUDM/CodeGeeX',
  },
];
</script>
<template>
  <div class="codegeex-wrapper">
    <div class="description">
      <div class="title">简述</div>
      <div class="information">
        CodeGeeX 是一个具有 130 亿参数的大规模多语言代码生成模型。CodeGeeX
        基于华为MindSpore框架实现，在鹏城实验室“鹏城云脑II”中的192个节点（共1536个国产昇腾910
        AI处理器）上训练而成。截至2022年6月22日，CodeGeeX基于20多种编程语言的代码语料库（>8500亿标识符）预训练，训练历时两个月。CodeGeeX
        有以下几个独特的功能：
      </div>
      <ul class="function">
        <li v-for="(item, index) in feature" :key="index" class="function-list">
          <span class="function-item">{{ item.title }}</span>
          <span class="function-info">{{ item.info }}</span>
          <a
            v-if="item.title !== '• 多语言代码生成：'"
            :href="item.link"
            target="_blank"
          >
            {{ item.linkText }}</a
          >
        </li>
      </ul>
      <div class="information">
        为了更加系统评估CodeGeeX的性能，团队提出了一个全新的多编程语言评测基准HumanEval-X，包含820个人工编写的高质量代码生成题目、测试用例与参考答案，
        覆盖5种编程语言（Python、C++、Java、JavaScript、Go），支持代码生成、翻译等任务的评测。CodeGeeX在Python、C++、Java、JavaScript和Go这五种主流编程语言的生成和翻译上，平均性能超越当前所有其他开源模型。
      </div>
      <div class="performance-img">
        <img :src="performance" alt="" />
      </div>
      <div class="performance-tips">
        在HumanEval-X代码生成任务上，与其它开源基线模型相比，CodeGeeX取得了最佳的平均性能。
      </div>
    </div>
    <div class="feature">
      <div class="title">CodeGeeX：多语言代码生成模型</div>
      <div class="framework">
        <div class="framework-desc">
          <span class="framework-item"> 架构：</span>
          <span class="framework-info">
            CodeGeeX是一个基于Transformers的大规模预训练编程语言模型。它是一个从左到右生成的自回归解码器，将代码或自然语言标识符
            （token）作为输入，预测下一个标识符的概率分布。CodeGeeX含有40个Transformer层，每层自注意力块的隐藏层维数为5120，前馈层维数为20480，总参数量为130亿。模型支持的最大序列长度为2048。
          </span>
        </div>
        <div class="framework-img">
          <img :src="framework" alt="" />
        </div>
        <div class="framework-tips">
          左侧：CodeGeeX训练数据中各编程语言占比。
          右侧：CodeGeeX训练损失函数随训练步数下降曲线。
        </div>
      </div>
      <div class="corpus">
        <span class="corpus-item">代码语料库：</span>
        <span class="corpus-info"
          >CodeGeeX的训练语料由两部分组成。第一部分是开源代码数据集，The Pile 与
          CodeParrot。The Pile包含GitHub上拥有超过100颗星的一部分开源仓库，
          我们从中选取了23种编程语言的代码。第二部分是补充数据，直接从GitHub开源仓库中爬取Python、Java、C++代码；为了获取高质量数据，我们根据以下准则选取代码仓库：
          1)至少拥有1颗星；2)总大小&lt10MB；3)不在此前的开源代码数据集中。我们还去掉了符合下列任一条件的文件：1)平均每行长度大于100字符；2)由自动生成得到；3)含有的
          字母不足字母表内的40%；4)大于100KB或小于1KB。为了让模型区分不同语言，我们在每个样本的开头加上一个前缀，其形式为[注释符]
          language: [语言]，例如：# language:
          Python。我们使用与GPT-2相同的分词器，并将空格处理为特殊标识符，词表大小为50400。整个代码语料含有23种编程语言、总计1587亿个标识符（不含填充符）。
        </span>
      </div>
    </div>
    <div class="train">
      <div class="train-title">国产平台实现与训练</div>
      <div class="train-info1">
        我们在昇思MindSpore框架1.7版本上实现了CodeGeeX模型，并使用鹏城实验室的全国产计算平台上进行训练。具体来说，CodeGeeX使用了其一个计算集群中的1536个昇腾910
        AI处理器（32GB）进行了两个月左右的训练（2022年4月18日至6月22日）。除了Layer-norm与Softmax使用FP32格式以获得更高的精度与稳定性，模型参数整体使用FP16格式，最终整个模型需要占用约27GB显存。为了增加训练效率，我们使用8路模型并行和192路数据并行的训练策略，微批次大小为16、全局批次大小为3072，并采用ZeRO-2优化器降低显存占用。
      </div>
      <div class="train-info2">
        在开发与训练过程中，我们和华为MindSpore团队合作，对MindSpore框架进行了部分优化，进而大幅度提升训练效率。比如，我们发现矩阵乘法的计算时间占比仅为22.9%，大量时间被用于各类其它算子，因此实现了一系列算子融合，包括单元素算子融合、层归一化算子融合、FastGelu与矩阵乘法融合、批量矩阵乘法与加法融合等；再比如我们还对矩阵乘法算子的维度实现自动搜索调优，使其搜索出效率最高的计算维度组合。这些优化为训练速度带来了显著提升，在同等GPU卡数规模下（128卡），昇腾910对CodeGeeX这一模型的训练效率从约为NVIDIA
        A100的16.7%提升至43%；在千卡规模下，昇腾910训练效率相比自身优化前提升近300%。使用优化后的软硬件训练时，CodeGeeX单日训练量可达到54.3B个标识符（含填充符），证明了国产深度学习平台与工具的快速迭代能力以及强大竞争力。
      </div>
    </div>
    <div class="baseline">
      <div class="baseline-title">HumanEval-X：多语言程序合成的新基准</div>
      <div class="baseline-description">
        为了更好地评测代码生成模型的多语言生成能力，我们构建了一个新基准HumanEval-X。此前，多语言代码生成能力是基于语义相似度（比如CodeBLEU）衡量的，具有一定误导性；HumanEval-X则可用于衡量生成代码的功能正确性。HumanEval-X包含820个高质量手写样本，覆盖Python、C++、Java、JavaScript、Go，适用于多种任务。
      </div>
      <div class="baseline-img">
        <img :src="baseline" alt="" />
      </div>
      <div class="baseline-description description2">
        HumanEval-X支持的任务示例。声明、描述、解答分别用红、绿、蓝色标注。代码生成将声明与描述作为输入，输出解答。代码翻译将两种语言的声明与源语言的解答作为输入，输出目标语言的解答。
      </div>
      <div class="baseline-description">
        HumanEval-X中每个语言的样本，包含了声明、描述和解答，它们之间的组合可以支持不同的下游任务，包括生成、翻译、概括等。我们目前关注两个任务：代码生成与代码翻译。对于代码生成任务，模型将函数声明与文档字符串作为输入，输出函数实现；对于代码翻译任务，模型将两种语言的函数声明与源语言的实现作为输入，输出目标语言上的实现。我们在代码翻译任务中不将文档字符串输入模型，以避免模型直接通过描述生成答案。在两种任务下，我们都采用Codex论文中所使用的无偏pass@k指标来判断生成代码的功能正确性：
      </div>
      <div class="baseline-formula">
        <img :src="formula" alt="" />
      </div>
    </div>
    <div class="multilingual-code">
      <div class="code-title">多语言代码生成</div>
      <div class="multilingual-img">
        <img :src="codeGeneration" alt="" />
      </div>
      <div class="multilingual-tips">
        左侧: HumanEval-X中五种语言具体的pass@k（k=1,10,100）性能。右侧:
        模型在所有语言上的平均性能。CodeGeeX的平均表现优于InCoder-6.7B和CodeGen-Multi-6B/16B。
      </div>
      <div class="multilingual-text">
        我们将CodeGeeX与另外两个开源代码生成模型进行比较，分别为Meta的InCoder与Salesforce的CodeGen，选取InCoder-6.7B、CodeGen-Multi-6B
        与
        CodeGen-Multi-16B。结果显示CodeGeeX能获得最佳的平均性能，其正确性显著超越了参数量更小的模型(7.5%~16.3%的提升)，且与参数量更大的模型CodeGen-Multi-16B表现相当（平均性能
        54.76% vs. 54.39%）。
      </div>
    </div>
    <div class="cross-language">
      <div class="language-title">跨语言代码翻译</div>
      <div class="result-img">
        <img :src="codeGeneration2" alt="" />
      </div>
      <div class="result-tips">
        HumanEval-X上的代码翻译任务结果。加粗结果表示在每种语言pass@k上的最佳效果。
      </div>
      <div class="result-text">
        我们还评测了模型在多语言间代码翻译上的性能。对于CodeGeeX，我们评测了未经微调的CodeGeeX-13B与经过微调的CodeGeeX-13B-FT（使用XLCoST中代码翻译任务的训练集与一部分Go语言数据微调）。如上表显示，模型对特定语言存在偏好，比如CodeGeeX擅长将其他语言翻译为Python与C++，而CodeGen-Multi-16B擅长翻译为JavaScript和Go，这可能是由于训练集中的语料占比存在差异。在20个翻译实验中，我们还观察到两种语言互相翻译的表现常常是呈负相关的，这可能说明现有的模型还不足以学好所有的语言。
      </div>
    </div>
    <div class="baseline-means">
      <div class="title">CodeGeeX开源开放，欢迎开发者们加入！</div>
      <div class="baseline-text">
        CodeGeeX所有代码和模型权重都是开源的，我们非常欢迎社区开发者们加入CodeGeeX开发，打造更好的生态。CodeGeeX拥有强大的代码生成能力，可以用于前端开发、游戏开发、数学问题求解等诸多领域，有着无限的可能性。
      </div>
      <div class="contact">
        如果对CodeGeeX有任何意见和建议，请在GitHub仓库（https://github.com/THUDM/CodeGeeX）中反馈，或者通过codegeex@aminer.cn与我们联系。
      </div>
    </div>
    <!-- <div class="generation-example">
      <div class="title">生成示例</div>
      <div class="example-img">
        <img :src="generationExample" alt="" />
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.codegeex-wrapper {
  padding: 36px 80px;
  background-color: #fff;
  .description {
    .title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      font-weight: 500;
      color: #000000;
    }
    .information {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin: 24px 0 16px;
    }
    .function {
      .function-list {
        font-size: 14px;
        color: #555;
        line-height: 22px;
        margin-bottom: 8px;
        font-weight: 400;
        .function-item {
          color: #000000;
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .performance-img {
      text-align: center;
      img {
        width: 60%;
      }
    }
    .performance-tips {
      text-align: center;
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-top: 16px;
    }
  }
  .feature {
    margin-top: 40px;
    .title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 500;
      color: #000000;
    }
    .framework {
      &-desc {
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-bottom: 24px;
        .framework-item {
          color: #000000;
        }
      }
      .framework-img {
        text-align: center;
        img {
          width: 80%;
        }
      }
      &-tips {
        text-align: center;
        line-height: 22px;
        font-size: 14px;
        color: #555555;
        margin-top: 16px;
      }
    }
    .corpus {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-top: 24px;
      margin-bottom: 16px;

      &-item {
        color: #000000;
      }
    }
  }
  .train {
    line-height: 22px;
    font-size: 14px;
    color: #555555;
    margin-top: 40px;

    &-title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 500;
      color: #000000;
    }
    &-info1 {
      margin-bottom: 16px;
    }
  }
  .baseline {
    margin-top: 40px;
    &-title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 500;
      color: #000000;
    }
    &-description {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-bottom: 10px;
    }
    .description2 {
      margin: 16px 0;
    }
    .baseline-img {
      text-align: center;
      img {
        width: 60%;
      }
    }
    .baseline-formula {
      text-align: center;
      img {
        width: 40%;
        height: 70px;
      }
    }
  }
  .multilingual-code {
    margin-top: 40px;
    .code-title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 500;
      color: #000000;
    }
    .multilingual-img {
      text-align: center;
      img {
        width: 90%;
      }
    }
    .multilingual-tips {
      text-align: center;
    }
    .multilingual-tips,
    .multilingual-text {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-top: 16px;
    }
  }
  .cross-language {
    margin-top: 40px;
    .language-title {
      width: 100%;
      line-height: 32px;
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 500;
      color: #000000;
    }
    .result-img {
      text-align: center;
      margin-top: 24px;
      img {
        width: 80%;
      }
    }
    .result-tips {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-top: 16px;
      text-align: center;
    }
    .result-text {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
      margin-top: 16px;
    }
  }
  .baseline-means {
    margin-top: 24px;
    .title {
      height: 28px;
      line-height: 24px;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #000000;
    }
    .baseline-text,
    .contact {
      line-height: 22px;
      font-size: 14px;
      color: #555555;
    }
    .contact {
      margin-top: 8px;
    }
  }
  /* .generation-example {
    margin-top: 24px;
    .title {
      height: 28px;
      line-height: 24px;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #000000;
    }
    .example-img {
      img {
        width: 100%;
      }
    }
  } */
}
</style>
