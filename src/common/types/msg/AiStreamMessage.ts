import CustomMessage, {MsgType} from "@/common/types/msg/interfaces/CustomMessage";
import {MsgT} from "@/common/types/msg/interfaces/MsgT";
import {Topic} from "@/fronted/hooks/useChatPanel";

class AiStreamMessage implements CustomMessage<AiStreamMessage> {
    public taskId: number;
    public topic: Topic;

    constructor(topic: Topic, taskId: number) {
        this.taskId = taskId;
    }

    toMsg(): MsgT[] {
        return [];
    }

    msgType: MsgType = "ai-streaming";

    copy(): AiStreamMessage {
        return new AiStreamMessage(this.topic, this.taskId);
    }
}

export default AiStreamMessage;
